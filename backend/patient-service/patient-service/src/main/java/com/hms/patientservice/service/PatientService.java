package com.hms.patientservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.patientservice.dto.PatientDTO;
import com.hms.patientservice.model.Patient;
import com.hms.patientservice.model.User;
import com.hms.patientservice.repository.PatientRepository;
import com.hms.patientservice.repository.UserRepository;

@Service
public class PatientService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PatientRepository patientRepository;
	
	public Patient create(PatientDTO dto) {
		User user = userRepository.findById(dto.getUserId())
				.orElseThrow(() -> new RuntimeException("User not found."));
		
		Patient patient = new Patient();
		patient.setUser(user);
		patient.setDob(dto.getDbo());
		patient.setGender(dto.getGender());
		patient.setContact(dto.getContact());
		return patientRepository.save(patient);
	}
	
	public List<Patient> getAll(){
		return patientRepository.findAll();
	}
}
