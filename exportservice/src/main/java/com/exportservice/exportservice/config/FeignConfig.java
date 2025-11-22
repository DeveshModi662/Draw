package com.exportservice.exportservice.config;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor authInterceptor() {
        System.out.println("dk-feign configuration");
        return requestTemplate -> {            
            System.out.println("dk-feign configuration-1");
            ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes() ;
            System.out.println("dk-feign configuration-2");
            if(attr != null) {
                System.out.println("dk-feign configuration-3");
                String authHeader = attr.getRequest().getHeader("Authorization") ;                
                System.out.println("dk-feign configuration-4");
                if(authHeader != null) {
                    System.out.println("dk-feign configuration-5");
                    requestTemplate.header("Authorization", authHeader) ;
                    System.out.println("dk-feign configuration-6-"+authHeader);
                }
            }
        } ;
    }

}
