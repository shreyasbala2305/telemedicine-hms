package com.hms.authservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.authservice.dto.AuthRequest;
import com.hms.authservice.dto.AuthResponse;
import com.hms.authservice.dto.RegisterRequest;
import com.hms.authservice.model.User;
import com.hms.authservice.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired 
	private AuthService authService;
	
//	@PostMapping("/register")
//	public ResponseEntity<User> register(@RequestBody UserDTO dto){
//		return new ResponseEntity<>(authService.register(dto), HttpStatus.CREATED);
//	}
	
	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
	    User savedUser = authService.register(request);
	    return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
	}

	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest){
			return ResponseEntity.ok(authService.login(authRequest));
	}
	
	@GetMapping("/test")
	public ResponseEntity<String> testEndpoint() {
	    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    return ResponseEntity.ok("Authenticated as: " + auth.getName());
	}

}
