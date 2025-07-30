package com.hms.authservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hms.authservice.dto.AuthRequest;
import com.hms.authservice.dto.AuthResponse;
import com.hms.authservice.dto.UserDTO;
import com.hms.authservice.model.User;
import com.hms.authservice.repository.UserRepository;
import com.hms.authservice.util.JwtUtil;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	public User register(UserDTO dto) {
		if(userRepository.findByEmail(dto.email).isPresent()) {
			throw new RuntimeException("Email already register");
		}
		
		User user = new User();
		user.setEmail(dto.email);
		user.setPassword(passwordEncoder.encode(dto.password));
		user.setFullName(dto.fullName);
		user.setRole(dto.role);
		return userRepository.save(user);
	}
	
	public AuthResponse login(AuthRequest authRequest) {
		User user = userRepository.findByEmail(authRequest.email)
				.orElseThrow(() -> new RuntimeException("Invalid credentials"));
		
		if(!passwordEncoder.matches(authRequest.password, user.getPassword())) {
			throw new RuntimeException("Invalid credentials");
		}
		
		String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getFullName());
		return new AuthResponse(token, user.getRole(), user.getFullName());
	}
}
