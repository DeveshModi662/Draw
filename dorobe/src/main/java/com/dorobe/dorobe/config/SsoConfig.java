package com.dorobe.dorobe.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;
import com.dorobe.dorobe.filter.SsoFilter;

@Configuration
@EnableWebSecurity
public class SsoConfig {

    @Value("${cors.url2}")
    private String corsUrl2 ;

    @Autowired
    private SsoFilter ssoFilter ;

    @Autowired
    UserDetailsService userDetailsService ;

    @Bean
    public SecurityFilterChain getSsoFilterChain(HttpSecurity httpSecurity) throws Exception {
        System.out.println("dk-SsoConfig-getSsoFilterChain()");
        return httpSecurity
            // .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
            .csrf(customizer -> customizer.disable()) 
            .authorizeHttpRequests(request -> request
                .requestMatchers("signUp", "login", "isLoggedIn", "sendOtp")
                .permitAll()
                .anyRequest()
                .authenticated()            
            )
            // .formLogin(Customizer.withDefaults())
            .httpBasic(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(ssoFilter, UsernamePasswordAuthenticationFilter.class)
            .build() ;
    }

    @Bean
    public AuthenticationProvider getAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService) ;
        authProvider.setPasswordEncoder(new BCryptPasswordEncoder(12)) ;
        // authProvider.setUserDetailsService(userDetailsService) ;
        return authProvider ;
    }

    @Bean
    public  AuthenticationManager getAuthenticationManager(AuthenticationConfiguration authConfig) throws Exception {        
        return authConfig.getAuthenticationManager() ;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        System.out.println("dk-SsoConfig-corsConfigurationSource()");
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(corsUrl2));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
