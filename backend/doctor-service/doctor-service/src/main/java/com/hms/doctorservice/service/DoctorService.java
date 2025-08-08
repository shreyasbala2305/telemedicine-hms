package com.hms.doctorservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.doctorservice.dto.DoctorDTO;
import com.hms.doctorservice.dto.EmailNotificationDTO;
import com.hms.doctorservice.feign.NotificationClient;
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
	
//	private static final Logger log = LoggerFactory.getLogger(DoctorService.class);
	
	public DoctorDTO createDoctor(DoctorDTO dto) {
		Doctor doctor = new Doctor();
		doctor.setName(dto.getName());
		doctor.setEmail(dto.getEmail());
		doctor.setContact(dto.getContact());
		doctor.setSpeciality(dto.getSpeciality());
		doctor.setQualification(dto.getQualification());
		doctor.setAvailability(dto.getAvailability());
		
		Doctor saved = doctorRepository.save(doctor);
		
		EmailNotificationDTO email = new EmailNotificationDTO();
		email.setTo(dto.getEmail());
		email.setSubject("Welcome Dr. " + dto.getName());
		email.setBody("Your doctor profile has been successfully created.");
		notificationClient.sendEmail(email);
		try {
			   notificationClient.sendEmail(email);
			} catch (Exception ex) {
			   log.warn("Notification service unavailable: {}", ex.getMessage());
			}
		
		DoctorDTO result = new DoctorDTO();
		result.setId(saved.getId());
		result.setName(saved.getName());
		result.setEmail(saved.getEmail());
		result.setContact(saved.getContact());
		result.setQualification(saved.getQualification());
		result.setSpeciality(saved.getSpeciality());
		result.setAvailability(saved.getAvailability());
		
		return result;
//		return mapToDTO(saved);
	}
	
//	private DoctorDTO mapToDTO(Doctor doctor) {
//		DoctorDTO dto = new DoctorDTO();
//	    dto.setId(doctor.getId());
//	    dto.setName(doctor.getName());
//	    dto.setEmail(doctor.getEmail());
//	    dto.setContact(doctor.getContact());
//	    dto.setSpeciality(doctor.getSpeciality());
//	    dto.setQualification(doctor.getQualification());
//	    dto.setAvailability(doctor.getAvailability());
//	    return dto;
//	}

	public List<Doctor> getAll(){
		return doctorRepository.findAll();
	}
	
	@SuppressWarnings("deprecation")
	public Doctor getDoctorById(Long id) {
		return doctorRepository.getById(id);
	}
	
	public List<Doctor> getDoctorsBySpeciality(String speciality){
		return doctorRepository.findBySpeciality(speciality);
	}
	
	public Doctor updateAvailability(Long id, List<String> newAvailability) {
		Doctor doctor = doctorRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Doctor not found"));
		
		doctor.setAvailability(newAvailability);
		return doctorRepository.save(doctor);
	}
}
