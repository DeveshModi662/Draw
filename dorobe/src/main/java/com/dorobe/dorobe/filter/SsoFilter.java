package com.dorobe.dorobe.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dorobe.dorobe.service.JwtService;
import com.dorobe.dorobe.service.SsoUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SsoFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService ;

    @Autowired
    private SsoUserDetailsService ssoUserDetailsService ;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("dk-SsoFilter-doFilterInternal()");
        System.out.println("dk-SsoFilter-doFilterInternal()"+request.getAttribute("username")+","+request.getAttribute("password"));
        String jwt = (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer "))
                    ? request.getHeader("Authorization").substring(7)
                    : null ;
        System.out.println("dk-SsoFilter-doFilterInternal()-"+request.getHeader("Authorization"));
        if(jwt != null) {
            String tokenUsername = jwtService.getUsernameFromToken(jwt) ;
            System.out.println("dk-SsoFilter-doFilterInternal()-" + tokenUsername);
            if(tokenUsername != null
                && SecurityContextHolder.getContext().getAuthentication() == null
                    // Means no authentication has yet been established for this request.
                    // Prevents Overwriting Existing Authentication. Imagine another security mechanism (e.g., Basic Auth, SSO, or Session login) has already set authentication in the context.
            ) { 
                System.out.println("dk-SsoFilter-doFilterInternal()-not logged in already");
                UserDetails ssoUserDetail = ssoUserDetailsService.loadUserByUsername(tokenUsername) ;
                System.out.println("dk-SsoFilter-doFilterInternal()-not logged in already-"+ssoUserDetail.getUsername());
                if(jwtService.validateToken(jwt, ssoUserDetail)) {
                    System.out.println("dk-SsoFilter-doFilterInternal()-not logged in already-token validated");
                    UsernamePasswordAuthenticationToken newAuthToken = new UsernamePasswordAuthenticationToken(ssoUserDetail, null, ssoUserDetail.getAuthorities()) ;
                    SecurityContextHolder.getContext().setAuthentication(newAuthToken) ;
                } 
            }
        }
        filterChain.doFilter(request, response);
    }

}
