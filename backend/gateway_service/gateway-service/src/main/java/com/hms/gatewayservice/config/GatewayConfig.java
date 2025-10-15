package com.hms.gatewayservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

import com.hms.gatewayservice.security.JwtAuthenticationFilter;

@Configuration
@EnableWebFluxSecurity
public class GatewayConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public GatewayConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

//    @Bean
//    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
//        return http
//                .csrf(csrf -> csrf.disable())
//                .formLogin(form -> form.disable())
//                .httpBasic(basic -> basic.disable())
//                .authorizeExchange(exchanges -> exchanges
//                        .pathMatchers(
//                                "/auth-service/auth/login",
//                                "/auth-service/auth/register",
//                                "/auth/login",
//                                "/auth/register"
//                        ).permitAll()
//                        .anyExchange().authenticated()
//                )
//                .build();
//    }
    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http) {
        http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                .anyExchange().permitAll()
            )
            .securityContextRepository(NoOpServerSecurityContextRepository.getInstance()) // optional, disables context storage
            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
            .formLogin(ServerHttpSecurity.FormLoginSpec::disable);
        return http.build();
    }
}
