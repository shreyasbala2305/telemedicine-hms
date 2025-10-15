package com.hms.gatewayservice.security;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cloud.gateway.filter.GatewayFilterChain;
//import org.springframework.cloud.gateway.filter.GlobalFilter;
//import org.springframework.core.Ordered;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//
//import reactor.core.publisher.Mono;
////
////@Component
////public class JwtAuthenticationFilter implements GlobalFilter, Ordered {
////
////	private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
////	
////    @Autowired
////    private JwtUtil jwtUtil;
////
////    @Override
////    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
////        String path = exchange.getRequest().getURI().getPath();
////
////        // Skip login/register endpoints
////        if (path.startsWith("/auth/") ||
////        	    path.startsWith("/auth-service/auth/login") ||
////        	    path.startsWith("/auth-service/auth/register")) {
////        	    return chain.filter(exchange);
////        	}
////
////
////        // Get Authorization header
////        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
////        log.info("AuthHeader={}", authHeader); 
////        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
////            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
////            return exchange.getResponse().setComplete();
////        }
////
////        String token = authHeader.substring(7);
////        boolean valid = jwtUtil.validateToken(token);
////        log.info("ValidToken={}", valid); 
////        if (!jwtUtil.validateToken(token)) {
////            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
////            return exchange.getResponse().setComplete();
////        }
////
////        // ✅ Forward request with user info if needed
////        return chain.filter(exchange.mutate()
////                .request(builder -> builder.header("X-Authenticated-User", jwtUtil.extractUsername(token)))
////                .build());
////    }
////
////    @Override
////    public int getOrder() {
////        return -1;
////    }
////}
//
//
//@Component
//public class JwtAuthenticationFilter implements GlobalFilter, Ordered {
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//        String path = exchange.getRequest().getURI().getPath();
//        log.info("Incoming request path={}", path);
//
//        // 🔓 Skip authentication for login/register routes
//        if (path.startsWith("/auth-service/auth/login") || path.startsWith("/auth-service/auth/register")) {
//            log.info("Skipping JWT auth for path={}", path);
//            return chain.filter(exchange);
//        }
//
//        // 🧾 Extract token
//        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
//        log.info("Authorization Header={}", authHeader);
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            log.error("Missing or invalid Authorization header");
//            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//            return exchange.getResponse().setComplete();
//        }
//
//        String token = authHeader.substring(7);
//        log.info("Extracted Token={}", token);
//
//        // ✅ Validate token
//        if (!jwtUtil.validateToken(token)) {
//            log.error("Invalid or expired JWT token");
//            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//            return exchange.getResponse().setComplete();
//        }
//
//        // 🧍 Extract username for downstream services
//        String username = jwtUtil.extractUsername(token);
//        log.info("JWT validated successfully. Username={}", username);
//
//        // 🔁 Forward user identity + Authorization downstream
//        return chain.filter(exchange.mutate()
//                .request(builder -> builder
//                        .header("X-Authenticated-User", username)
//                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
//                .build());
//    }
//
//    @Override
//    public int getOrder() {
//        return -1;
//    }
//}



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // skip auth for login/register
        if (path.startsWith("/auth/") || path.startsWith("/auth-service/auth/")) {
            return chain.filter(exchange);
        }

        // forward Authorization header as-is
        String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (token == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        
        return chain.filter(exchange.mutate()
                .request(r -> r.header(HttpHeaders.AUTHORIZATION, token))
                .build());
    }

    @Override
    public int getOrder() {
        return -1;
    }
}

