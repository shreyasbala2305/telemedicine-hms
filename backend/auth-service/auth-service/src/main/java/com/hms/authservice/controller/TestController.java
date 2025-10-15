package com.hms.authservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
public class TestController {

//    @GetMapping("/auth/test")
    public String testEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            return "✅ Authenticated as: " + authentication.getName();
        } else {
            return "❌ Authentication failed or no token provided";
        }
    }
}
