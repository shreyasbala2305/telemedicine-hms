package com.hms.authservice.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.hms.authservice.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {
	@Bean
	PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
	

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    private static final String FRONTEND_URL = "http://localhost:5173";
    
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // ✅ disable CSRF for non-browser clients
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/auth/register", "/auth/login", "/auth/test").permitAll() // allow register/login
                                .anyRequest().authenticated()
                ).addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
