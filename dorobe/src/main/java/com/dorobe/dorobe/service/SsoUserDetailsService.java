package com.dorobe.dorobe.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dorobe.dorobe.model.User;
import com.dorobe.dorobe.model.UserPrincipal;
import com.dorobe.dorobe.repository.UserRepository;

@Service
public class SsoUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo ;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        System.out.println("dk-SsoUserDetailsService-loadByUsername-"+username);
        User user = userRepo.findByUsername(username).get() ;
        if(user == null) {
            System.out.println("dk-SsoService-loadByUsername-username not found");
            throw new UnsupportedOperationException("dk-SsoService-loadByUsername-username not found");
        }
        return new UserPrincipal(user) ;
    }

}
