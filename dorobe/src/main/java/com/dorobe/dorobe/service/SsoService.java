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

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12) ;

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepo.save(user) ;
    }

    public User login(User user) {
        System.out.println("dk-SsoService-login-" + user.getUsername() + ", " +  user.getPassword());
        Authentication auth =
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            ) ;
        if(auth.isAuthenticated()) {
            user.setJsonWebToken(jwtService.generateToken(user.getUsername()));
            user.setPassword(null);
            return user ;
        }
        else {
            return null ;
        }
    }

    public String isLoggedIn() {
        return "SsoActive" ;
    }

}
