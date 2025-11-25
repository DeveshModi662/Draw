package com.dorobe.dorobe.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dorobe.dorobe.model.User;
import com.dorobe.dorobe.repository.UserRepository;
import com.dorobe.dorobe.service.SsoService;

// import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class SsoController {

    @Autowired
    private UserRepository userRepo ;

    @Autowired
    private SsoService ssoService ;

    // @GetMapping("/getCsrfToken")
    // public CsrfToken getCsrfToken(HttpServletRequest request) {
    //     System.out.println("dk-SsoController-getCsrfToken()-"+request.getAttribute("_csrf"));
    //     return (CsrfToken) request.getAttribute("_csrf") ;
    // }

    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        System.out.println("dk-SsoController-getAllUsers()");
        return userRepo.findAll().stream()
                                    .map(user -> {
                                        User dto = user;
                                        dto.setPassword(null);
                                        dto.setId(null);
                                        dto.setUserCanvas(null);
                                        return dto;
                                    }).collect(Collectors.toList()) ;
    } 

    // @PostMapping("/addUser")
    // public User addUser(@RequestBody User newUser) {
    //     System.out.println("dk-SsoController-addUser()");
    //     return userRepo.save(newUser) ;
    // }

    // @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/sendOtp")
    public void sendOtp(@RequestBody User newUser) throws Exception {
        System.out.println("dk-SsoController-sendOtp()");
        ssoService.sendOtp(newUser) ;
    }

    // @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/signUp")
    public User signUp(@RequestBody User newUser) throws Exception {
        System.out.println("dk-SsoController-signUp()");
        return ssoService.register(newUser) ;
    }

    // @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/login")
    public User login(@RequestBody User userPrincipal) {
        System.out.println("dk-SsoController-login()");
        return ssoService.login(userPrincipal) ;
    }  

    // @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/isLoggedIn")
    public String isLoggedIn() {
        System.out.println("dk-SsoController-isLoggedIn()");
        return ssoService.isLoggedIn() ;
    }  
    
    
}

