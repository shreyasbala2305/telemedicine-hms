package com.hms.patientservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.patientservice.client.NotificationClient;
import com.hms.patientservice.dto.MessageNotificationDTO;
import com.hms.patientservice.dto.NotificationDTO;
import com.hms.patientservice.dto.PatientDTO;
import com.hms.patientservice.model.Patient;
import com.hms.patientservice.repository.PatientRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PatientService {
	
	@Autowired
	private PatientRepository patientRepository;
	
	@Autowired
	private NotificationClient notificationClient;
	
	public PatientDTO create(PatientDTO dto) {
		Patient patient = new Patient();
		patient.setUserId(dto.getUserId());
		patient.setName(dto.getName());
		patient.setEmail(dto.getEmail());
		patient.setGender(dto.getGender());
		patient.setDob(dto.getDob());
		patient.setContact(dto.getContact());
		
		patientRepository.save(patient);
		
//		MessageNotificationDTO sms = new MessageNotificationDTO();
//        sms.setPhoneNumber(dto.getContact());
//        sms.setMessage("Welcome to our Healthcare System, " + dto.getName());
//
//        notificationClient.sendMessage(sms);
        
		NotificationDTO notification = new NotificationDTO();
		notification.setRecipientId(patient.getId());
        notification.setRecipientEmail(dto.getEmail());
        String contact = dto.getContact();
        if (!contact.startsWith("+")) {
            contact = "+91" + contact;
        }
        notification.setRecipientContact(contact);
        notification.setType("SMS");
        notification.setMessage("Welcome to our Healthcare System, " + dto.getName());

        try {
        	notificationClient.send(notification);
        }catch(Exception e) {
        	log.warn("⚠️ Notification service unavailable, continuing registration", e);
        }
        return dto;
	}
	
	public List<Patient> getAll(){
		return patientRepository.findAll();
	}
	
	public Patient getPatient(Long id) {
        return patientRepository.findById(id).orElseThrow();
    }

}
