package com.hms.patientservice.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.patientservice.dto.UserDTO;
import com.hms.patientservice.model.User;
import com.hms.patientservice.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	public User register(UserDTO dto) {
		User user = new User();
		user.setName(dto.getName());
		user.setEmail(dto.getEmail());
		user.setPassword(dto.getPassword());
		user.setRole(dto.getRole());
		
		return userRepository.save(user);
	}
	
	public Optional<User> getById(Long id){
		return userRepository.findById(id);
	}
}
