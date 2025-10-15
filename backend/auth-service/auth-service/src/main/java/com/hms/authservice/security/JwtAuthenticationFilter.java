package com.hms.authservice.security;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cloud.gateway.filter.GatewayFilterChain;
//import org.springframework.cloud.gateway.filter.GlobalFilter;
//import org.springframework.core.Ordered;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//
//import com.hms.authservice.util.JwtUtil;
//
//import lombok.extern.slf4j.Slf4j;
//import reactor.core.publisher.Mono;
//
//@Slf4j
//@Component
//public class JwtAuthenticationFilter implements GlobalFilter, Ordered {
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//        String path = exchange.getRequest().getURI().getPath();
//        log.info("Incoming request path={}", path);
//
//        // Skip auth for login/register
//        if (path.startsWith("/auth-service/auth/login") || path.startsWith("/auth-service/auth/register")) {
//            log.info("Skipping auth for path={}", path);
//            return chain.filter(exchange);
//        }
//
//        // Check Authorization header
//        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
//        log.info("AuthHeader={}", authHeader);
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
//        boolean valid = jwtUtil.validateToken(token);
//        log.info("ValidToken={}", valid);
//
//        if (!valid) {
//            log.error("Invalid or expired token");
//            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//            return exchange.getResponse().setComplete();
//        }
//
//        String username = jwtUtil.getUsernameFromToken(token);
//        log.info("Extracted Username from JWT={}", username);
//
//        // forward user info downstream
//        return chain.filter(exchange.mutate()
//                .request(builder -> builder.header("X-Authenticated-User", username))
//                .build());
//    }
//
//    @Override
//    public int getOrder() {
//        return -1;
//    }
//}

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.hms.authservice.util.JwtUtil;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException, java.io.IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);

        try {
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromToken(token);
                String role = jwtUtil.getUserRole(token);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                new User(username, "", Collections.emptyList()),
                                null,
                                Collections.emptyList()
                        );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (JwtException e) {
            System.out.println("JWT validation failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
