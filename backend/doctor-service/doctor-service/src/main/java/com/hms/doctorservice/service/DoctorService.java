package com.hms.doctorservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import com.hms.doctorservice.client.AuthClient;
import com.hms.doctorservice.client.NotificationClient;
import com.hms.doctorservice.dto.AuthResponse;
import com.hms.doctorservice.dto.DoctorDTO;
import com.hms.doctorservice.dto.EmailNotificationDTO;
import com.hms.doctorservice.dto.RegisterRequest;
import com.hms.doctorservice.model.Doctor;
import com.hms.doctorservice.repository.DoctorRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class DoctorService {
	
	@Autowired
	private DoctorRepository doctorRepository;
	
	@Autowired
	private NotificationClient notificationClient;
	
	@Autowired
	private AuthClient authClient;
	
//	private static final Logger log = LoggerFactory.getLogger(DoctorService.class);
	
	public DoctorDTO createDoctor(DoctorDTO dto) {
		Doctor doctor = new Doctor();

	    doctor.setName(dto.getName());
	    doctor.setEmail(dto.getEmail());
	    doctor.setContact(dto.getContact());
	    doctor.setSpeciality(dto.getSpeciality());
	    doctor.setQualification(dto.getQualification());
	    doctor.setAvailability(dto.getAvailability());

	    try {
	        RegisterRequest req = new RegisterRequest();
	        req.setEmail(dto.getEmail());
	        req.setPassword("Temp@123");
	        req.setRole("DOCTOR");
	        req.setName(dto.getName());

	        AuthResponse res = authClient.register(req);
	        
	        System.out.println("========== AUTH DEBUG ==========");
	        System.out.println("FULL RESPONSE OBJECT: " + res);
	        System.out.println("USER ID FIELD: " + res.getUserId());
	        System.out.println("================================");

	        doctor.setUserId(res.getId());
	        
	        System.out.println("Auth response: " + res);
	        System.out.println("UserId: " + res.getUserId());

	    } catch (Exception e) {
	        log.warn("Auth service failed", e);
	    }

	    Doctor saved = doctorRepository.save(doctor);
	    log.info("SAVED DOCTOR userId: {}", saved.getUserId());

	    DoctorDTO result = new DoctorDTO();
	    result.setId(saved.getId());
	    result.setUserId(saved.getUserId());
	    result.setName(saved.getName());
	    result.setEmail(saved.getEmail());
		
		EmailNotificationDTO email = new EmailNotificationDTO();
		email.setTo(dto.getEmail());
		email.setSubject("Welcome Dr. " + dto.getName());
		email.setBody("Your doctor profile has been successfully created.");
		try {
			   notificationClient.sendEmail(email);
		} catch (Exception ex) {
		   log.warn("Notification service unavailable: {}", ex.getMessage());
		}
		
		return result;
	}

	public List<Doctor> getAll(){
		return doctorRepository.findAll();
	}
	
	public Doctor update(Long id, DoctorDTO dto) {

	    Doctor doctor = doctorRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Patient not found"));

	    doctor.setName(dto.getName());
	    doctor.setEmail(dto.getEmail());
	    doctor.setContact(dto.getContact());
	    doctor.setQualification(dto.getQualification());
	    doctor.setSpeciality(dto.getSpeciality());
	    doctor.setAvailability(dto.getAvailability());

	    return doctorRepository.save(doctor);
	}
	
	@GetMapping("/{id}")
	public Doctor getDoctorById(Long id) {
		return doctorRepository.findById(id).orElseThrow();
	}
	
	public List<Doctor> getDoctorsBySpeciality(String speciality){
		return doctorRepository.findBySpeciality(speciality);
	}
	
	public Doctor getByUserId(Long userId) {
	    return doctorRepository.findByUserId(userId)
	        .orElseThrow(() -> new RuntimeException("Doctor not found"));
	}
	
	public Doctor updateAvailability(Long id, List<String> newAvailability) {
		Doctor doctor = doctorRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Doctor not found"));
		
		doctor.setAvailability(newAvailability);
		return doctorRepository.save(doctor);
	}
}
