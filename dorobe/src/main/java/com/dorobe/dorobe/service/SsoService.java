package com.dorobe.dorobe.service;

import org.springframework.stereotype.Service;

import com.dorobe.dorobe.model.User;
import com.dorobe.dorobe.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class SsoService {
    
    @Autowired
    private UserRepository userRepo ;

    @Autowired
    private AuthenticationManager authManager ;
    
    @Autowired
    private JwtService jwtService ;

    @Autowired
    private OtpService otpService ;

    @Autowired
    private EmailService emailService ;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12) ;

    public User register(User user) throws Exception {
        System.out.println("dk-SsoService-register") ;
        if(!otpService.verifyOtp(user.getUsername(), user.getOtp())) {
            System.out.println("dk-SsoService-wrongOtp") ;
            throw new Exception("Wrong OTP") ;}
        if(!userRepo.findByUsername(user.getUsername()).isEmpty()) {
            System.out.println("dk-SsoService-user already exists") ;
            throw new Exception("Already exists.") ;
        }
        String pass = user.getPassword() ;
        user.setPassword(encoder.encode(user.getPassword()));        
        User savedUser = userRepo.save(user) ;
        savedUser.setPassword(pass) ;
        return this.login(savedUser) ;
    }

    public User login(User user) {
        System.out.println("dk-SsoService-login-" + user.getUsername() + ", " +  user.getPassword());
        Authentication auth =
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            ) ;
        if(auth.isAuthenticated()) {
            System.out.println("dk-SsoService-login-isAuthenticated") ; 
            user.setJsonWebToken(jwtService.generateToken(user.getUsername()));
            user.setPassword(null);
            return user ;
        }
        else {
            System.out.println("dk-SsoService-login-isNotAuthenticated") ;
            throw new RuntimeException("Wrong username/password") ;
        }
    }

    public String isLoggedIn() {
        return "SsoActive" ;
    }

    public void sendOtp(User newUser) throws Exception {
        System.out.println("dk-SsoService-sendOtp()");
        emailService.sendOtp(newUser.getUsername());
    }

}
