package com.hms.patientservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.patientservice.dto.PatientDTO;
import com.hms.patientservice.model.Patient;
import com.hms.patientservice.repository.PatientRepository;

@Service
public class PatientService {
	
	@Autowired
	private PatientRepository patientRepository;
	
	public Patient create(PatientDTO dto) {
		Patient patient = new Patient();
		patient.setName(dto.name);
		patient.setGender(dto.gender);
		patient.setDob(dto.dob);
		patient.setContact(dto.contact);
		
		return patientRepository.save(patient);
	}
	
	public List<Patient> getAll(){
		return patientRepository.findAll();
	}
	
	public Patient getPatient(Long id) {
        return patientRepository.findById(id).orElseThrow();
    }

}
