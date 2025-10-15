package com.hms.authservice.service;

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
import com.hms.authservice.dto.UserDTO;
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
		User savedUser = userRepository.save(user);
		
		if (savedUser.getRole() == Role.PATIENT) {
            PatientDTO patientDTO = new PatientDTO();
            patientDTO.setUserId(savedUser.getId());
            patientDTO.setName(savedUser.getFullName());
            patientDTO.setEmail(savedUser.getEmail());
            patientDTO.setContact(request.getContact());
            patientDTO.setDob(request.getDob());
            patientDTO.setGender(request.getGender());
            patientClient.createPatient(patientDTO);
        } 
        else if (savedUser.getRole() == Role.DOCTOR) {
            DoctorDTO doctorDTO = new DoctorDTO();
            doctorDTO.setUserId(savedUser.getId());
            doctorDTO.setName(savedUser.getFullName());
            doctorDTO.setContact(request.getContact());
            doctorDTO.setSpecialty(request.getSpecialty());
            doctorDTO.setQualification(request.getQualification());
            doctorClient.createDoctor(doctorDTO);
        }
		
		return savedUser;
		
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
