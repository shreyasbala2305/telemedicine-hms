package com.hms.authservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.authservice.dto.AuthRequest;
import com.hms.authservice.dto.AuthResponse;
import com.hms.authservice.dto.UserDTO;
import com.hms.authservice.model.User;
import com.hms.authservice.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired 
	private AuthService authService;
	
	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody UserDTO dto){
		return new ResponseEntity<>(authService.register(dto), HttpStatus.CREATED);
	}
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest){
			return ResponseEntity.ok(authService.login(authRequest));
	}
}
