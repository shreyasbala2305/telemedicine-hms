package com.hms.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
	@Bean
	PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // ✅ disable CSRF for non-browser clients
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/auth/register, /auth/login").permitAll() // allow register/login
                                .anyRequest().authenticated()
                );

        http
                .httpBasic(basic -> basic.disable())
                .formLogin(login -> login.disable());


        return http.build();
    }
}
