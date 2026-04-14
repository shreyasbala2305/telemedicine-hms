package com.hms.patientservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.hms.patientservice.client.AuthClient;
import com.hms.patientservice.client.NotificationClient;
import com.hms.patientservice.dto.AuthResponse;
import com.hms.patientservice.dto.NotificationDTO;
import com.hms.patientservice.dto.PatientDTO;
import com.hms.patientservice.dto.RegisterRequest;
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
	
	@Autowired
	private AuthClient authClient;
	
	public PatientDTO create(PatientDTO dto) {

        Patient patient = new Patient();
        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setGender(dto.getGender());
        patient.setDob(dto.getDob());
        patient.setContact(dto.getContact());

        try {
            RegisterRequest req = new RegisterRequest();
            req.setEmail(dto.getEmail());
            req.setPassword("Temp@123");
            req.setRole("PATIENT");

            AuthResponse res = authClient.register(req);

            patient.setUserId(res.getUserId()); // 🔥 FIXED
        } catch (Exception e) {
            log.warn("⚠️ Auth service failed, continuing without user", e);
        }

        Patient saved = patientRepository.save(patient);

        try {
            NotificationDTO notification = new NotificationDTO();
            notification.setRecipientId(saved.getId());
            notification.setRecipientEmail(saved.getEmail());

            String contact = saved.getContact();
            if (!contact.startsWith("+")) {
                contact = "+91" + contact;
            }

            notification.setRecipientContact(contact);
            notification.setType("SMS");
            notification.setMessage("Welcome to our Healthcare System, " + saved.getName());

            notificationClient.send(notification);

        } catch (Exception e) {
            log.warn("⚠️ Notification service unavailable, continuing", e);
        }

        PatientDTO response = new PatientDTO();
        response.setId(saved.getId());
        response.setUserId(saved.getUserId());
        response.setName(saved.getName());
        response.setEmail(saved.getEmail());
        response.setGender(saved.getGender());
        response.setDob(saved.getDob());
        response.setContact(saved.getContact());

        return response;
    }
	
	public List<Patient> getAll(){
		return patientRepository.findAll();
	}
	
	public Patient update(Long id, PatientDTO dto) {

	    Patient patient = patientRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Patient not found"));

	    patient.setName(dto.getName());
	    patient.setEmail(dto.getEmail());
	    patient.setGender(dto.getGender());
	    patient.setDob(dto.getDob());
	    patient.setContact(dto.getContact());

	    return patientRepository.save(patient);
	}
	
	public Patient getPatient(Long id) {
        return patientRepository.findById(id).orElseThrow();
    }
	
	public Page<Patient> getAllPaged(int page, int size, String search) {
	    Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

	    if (search != null && !search.isEmpty()) {
	        return patientRepository
	            .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
	    }

	    return patientRepository.findAll(pageable);
	}

}
