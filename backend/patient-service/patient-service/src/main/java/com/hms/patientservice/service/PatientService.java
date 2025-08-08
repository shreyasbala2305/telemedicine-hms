package com.hms.patientservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.patientservice.dto.MessageNotificationDTO;
import com.hms.patientservice.dto.PatientDTO;
import com.hms.patientservice.feign.NotificationClient;
import com.hms.patientservice.model.Patient;
import com.hms.patientservice.repository.PatientRepository;

@Service
public class PatientService {
	
	@Autowired
	private PatientRepository patientRepository;
	
	@Autowired
	private NotificationClient notificationClient;
	
	public PatientDTO create(PatientDTO dto) {
		Patient patient = new Patient();
		patient.setName(dto.getName());
		patient.setEmail(dto.getEmail());
		patient.setGender(dto.getGender());
		patient.setDob(dto.getDob());
		patient.setContact(dto.getContact());
		
		patientRepository.save(patient);
		
		MessageNotificationDTO sms = new MessageNotificationDTO();
        sms.setPhoneNumber(dto.getContact());
        sms.setMessage("Welcome to our Healthcare System, " + dto.getName());

        notificationClient.sendMessage(sms);
        
        return dto;
	}
	
	public List<Patient> getAll(){
		return patientRepository.findAll();
	}
	
	public Patient getPatient(Long id) {
        return patientRepository.findById(id).orElseThrow();
    }

}
