package com.hms.authservice.util;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.hms.authservice.model.Role;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    public String generateToken(String email, Role role, String name) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("name", name)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            System.out.println("JWT valid: " + token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("JWT invalid: " + e.getMessage());
            return false;
        }
    }

    
    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    
    public String getUserRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    
    public String getNameFromToken(String token) {
        return getClaims(token).get("name", String.class);
    }

    
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

