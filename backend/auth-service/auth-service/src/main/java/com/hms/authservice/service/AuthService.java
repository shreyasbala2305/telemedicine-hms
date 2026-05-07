package com.hms.authservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hms.authservice.client.DoctorClient;
import com.hms.authservice.client.PatientClient;
import com.hms.authservice.dto.AuthRequest;
import com.hms.authservice.dto.AuthResponse;
import com.hms.authservice.dto.DoctorDTO;
import com.hms.authservice.dto.PatientDTO;
import com.hms.authservice.dto.RegisterRequest;
import com.hms.authservice.model.Role;
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
	private PatientClient patientClient;
	
	@Autowired
	private DoctorClient doctorClient;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	public User register(RegisterRequest request) {
		if(userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new RuntimeException("Email already register");
		}
		
		User user = new User();
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setFullName(request.getName());
		user.setRole(request.getRole());
		return userRepository.save(user);		
		
	}
	
	public AuthResponse login(AuthRequest authRequest) {
		User user = userRepository.findByEmail(authRequest.email)
				.orElseThrow(() -> new RuntimeException("Invalid credentials"));
		
		if(!passwordEncoder.matches(authRequest.password, user.getPassword())) {
			throw new RuntimeException("Invalid credentials");
		}
		
		String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole(), user.getFullName());
		return new AuthResponse(token, user.getRole(), user.getFullName());
	}
	
	public List<User> getUsersByRole(String role) {
	    return userRepository.findByRole(Role.valueOf(role));
	}
}
