package com.hms.authservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.authservice.common.response.ApiResponse;
import com.hms.authservice.dto.AuthRequest;
import com.hms.authservice.dto.AuthResponse;
import com.hms.authservice.dto.RegisterRequest;
import com.hms.authservice.dto.UserResponseDTO;
import com.hms.authservice.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> register(
            @Valid @RequestBody RegisterRequest request) {

        UserResponseDTO savedUser =
                authService.register(request);

        return new ResponseEntity<>(
                ApiResponse.success(
                        "User registered successfully",
                        savedUser
                ),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/users/by-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getUsersByRole(
            @RequestParam String role) {

        List<UserResponseDTO> users =
                authService.getUsersByRole(role);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Users fetched successfully",
                        users
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AuthRequest authRequest) {

        AuthResponse response =
                authService.login(authRequest);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful",
                        response
                )
        );
    }

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> testEndpoint() {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Authentication successful",
                        "Authenticated as: " + auth.getName()
                )
        );
    }
}