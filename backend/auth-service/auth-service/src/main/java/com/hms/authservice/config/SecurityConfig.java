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

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // ✅ disable CSRF for non-browser clients
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/auth/register", "/auth/login", "/auth/test").permitAll() // allow register/login
                                .anyRequest().authenticated()
                ).addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//        		http        		
//        			.httpBasic(basic -> basic.disable())
//        			.formLogin(login -> login.disable());
        return http.build();
    }
}
