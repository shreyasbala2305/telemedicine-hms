package com.hms.gatewayservice.security;

//import java.security.Key;
//import java.util.Date;
//
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.stereotype.Component;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.JwtException;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.security.Keys;
//
//
////@Component
////@ConfigurationProperties(prefix = "jwt")
////public class JwtUtil {
////
////    private String secret;
////
////    public String getSecret() {
////        return secret;
////    }
////    public void setSecret(String secret) {
////        this.secret = secret;
////    }
////
////    private Key getSigningKey() {
////        return Keys.hmacShaKeyFor(secret.getBytes());
////    }
////    
////    //new token(have to try it)
//////    public String generateToken(String username, String role) {
//////        return Jwts.builder()
//////                .setSubject(username)
//////                .claim("role", role)
//////                .setIssuedAt(new Date())
//////                .setExpiration(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
//////                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//////                .compact();
//////    }
////    
////    public Claims extractClaims(String token) {
////        return Jwts.parserBuilder()
////                .setSigningKey(getSigningKey())
////                .build()
////                .parseClaimsJws(token)
////                .getBody();
////    }
////
////    public String extractUsername(String token) {
////        return extractClaims(token).getSubject();
////    }
////
////    private boolean isTokenExpired(String token) {
////        return extractClaims(token).getExpiration().before(new Date());
////    }
////
////    public boolean validateToken(String token) {
////        try {
////        	extractClaims(token);
////            return !isTokenExpired(token);
////        } catch (Exception e) {
////            return false;
////        }
////    }
////    //new validate(have to try it)
//////    public boolean validateToken(String token) {
//////        try {
//////            Jwts.parserBuilder()
//////                    .setSigningKey(getSigningKey())
//////                    .build()
//////                    .parseClaimsJws(token);
//////            return true;
//////        } catch (JwtException e) {
//////            return false;
//////        }
//////    }
////}
//
//@Component
//@ConfigurationProperties(prefix = "jwt")
//public class JwtUtil {
//
//    private String secret;
//
//    public String getSecret() {
//        return secret;
//    }
//
//    public void setSecret(String secret) {
//        this.secret = secret;
//    }
//
//    private Key getSigningKey() {
//        return Keys.hmacShaKeyFor(secret.getBytes());
//    }
//
//    public Claims extractClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(getSigningKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//
//    public String extractUsername(String token) {
//        return extractClaims(token).getSubject();
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            Claims claims = extractClaims(token);
//            Date expiration = claims.getExpiration();
//            return expiration.after(new Date());
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }
//}

//package com.hms.gatewayservice.security;

import java.security.Key;
import java.util.Date;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtUtil {

    private String secret;

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
