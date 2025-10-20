package com.dorobe.dorobe.service;

import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final byte[] SECRET_KEY ; 

    static {
        try {
        SECRET_KEY = Decoders.BASE64.decode(
            Base64
            .getEncoder()
            .encodeToString(
                KeyGenerator.getInstance("HmacSHA256")
                .generateKey()
                .getEncoded()
            ) 
        ) ;
                    
        } catch(NoSuchAlgorithmException e) {
            throw new RuntimeException(e) ;
        }
    }

    String generateToken(String username) {
        
        Map<String, Object> claims = new HashMap<>() ;
        
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + (60 * 60 * 1000)))
                .and()
                .signWith(this.getKey())
                .compact() ;
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY) ;
    }

    public String getUsernameFromToken(String jwt) {
        System.out.println("dk-JwtService-getUsernameFromToken()");
        Claims claims = Jwts
                        .parser()
                        .verifyWith(this.getKey())
                        .build()
                        .parseSignedClaims(jwt)
                        .getPayload() ;
        return claims.getSubject() ; 
    }

    public boolean validateToken(String jwt, UserDetails userByUsername) {
        Claims claims = Jwts
                        .parser()
                        .verifyWith(this.getKey())
                        .build()
                        .parseSignedClaims(jwt)
                        .getPayload() ;
        System.out.println("dk-JwtService-validateToken-"+userByUsername.getUsername()+"-"+claims.getSubject());
        return (!claims.getExpiration().before(new Date()) && userByUsername != null && claims.getSubject().equals(userByUsername.getUsername())) ;
    }
}
