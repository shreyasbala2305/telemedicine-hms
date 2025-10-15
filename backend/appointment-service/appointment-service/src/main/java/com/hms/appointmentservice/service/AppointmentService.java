package com.hms.appointmentservice.service;

import java.time.LocalDateTime;
import java.util.List;

import javax.sound.midi.Soundbank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.appointmentservice.client.DoctorClient;
import com.hms.appointmentservice.client.NotificationClient;
import com.hms.appointmentservice.client.PatientClient;
import com.hms.appointmentservice.dto.AppointmentDTO;
import com.hms.appointmentservice.dto.DoctorDTO;
import com.hms.appointmentservice.dto.EmailNotificationDTO;
import com.hms.appointmentservice.dto.MessageNotificationDTO;
import com.hms.appointmentservice.dto.NotificationDTO;
import com.hms.appointmentservice.dto.PatientDTO;
import com.hms.appointmentservice.exception.ResourceNotFoundException;
import com.hms.appointmentservice.model.Appointment;
import com.hms.appointmentservice.repository.AppointmentRepository;

@Service
public class AppointmentService {
	
	@Autowired
	private AppointmentRepository appointmentRepository;
	
	@Autowired
	private PatientClient patientClient;
	
	@Autowired
	private DoctorClient doctorClient;
	
	@Autowired
	private NotificationClient notificationClient;
	
//	@Autowired
//    private RestTemplate restTemplate;
//
//    private final String PATIENT_SERVICE_BASE = "http://localhost:8082/patients/";
//    private final String DOCTOR_SERVICE_BASE = "http://localhost:8084/doctors/";
//    private final String NOTIFICATION_SERVICE_BASE = "http://localhost:8086/notify";

	
	public AppointmentDTO bookAppointment(AppointmentDTO dto) {
		
		Long patientId = dto.getPatientId();
		Long doctorId = dto.getDoctorId();
		LocalDateTime dateTime = dto.getDateTime();
		
		//Validate patient exists
		PatientDTO patient = patientClient.getPatientById(patientId);
		if(patient == null)
//			throw new RuntimeException("Patient not found.");
			throw new ResourceNotFoundException("Patient not found with ID: " + patient.getId());

		
		//Validate doctor exists
		DoctorDTO doctor = doctorClient.getDoctorById(doctorId);
		if(doctor == null)
			throw new RuntimeException("Doctor not found.");
		
		
//		// Validate patient exists
//        try {
//            restTemplate.getForObject(PATIENT_SERVICE_BASE + dto.patientId, PatientDTO.class);
//        } catch (Exception e) {
//            throw new RuntimeException("Patient not found");
//        }
//
//        // Validate doctor exists
//        try {
//            restTemplate.getForObject(DOCTOR_SERVICE_BASE + dto.doctorId, DoctorDTO.class);
//        } catch (Exception e) {
//            throw new RuntimeException("Doctor not found");
//        }
		
		Appointment appointment = new Appointment();
		appointment.setPatientId(patientId);
		appointment.setDoctorId(doctorId);
		appointment.setDateTime(dateTime);
		appointment.setStatus(Appointment.Status.CONFIRMED); //CONFIRMED
		Appointment saved = appointmentRepository.save(appointment);
		
		EmailNotificationDTO email = new EmailNotificationDTO();
		email.setTo(patient.getEmail());
		email.setSubject("Invoice Generated");
		email.setBody("Your appointment with Dr. " + doctor.getName() + " is confirmed.");
		try {
			notificationClient.sendEmail(email);
		}catch(Exception e) {
			System.err.println("Failed to send notification "+ e.getMessage());
		}
		
		MessageNotificationDTO message = new MessageNotificationDTO();
		message.setPhoneNumber(patient.getContact());
		message.setMessage("Your appointment with Dr. " + doctor.getName() + " is confirmed.");
		try {
			notificationClient.sendMessage(message);
		}catch(Exception e) {
			System.err.println("Failed to send notification "+ e.getMessage());
		}
		
	
		NotificationDTO notify = new NotificationDTO();
	    notify.recipientId = dto.getPatientId();
	    notify.message = "Your appointment has been booked for " + dto.getDateTime();
	    notify.type = "EMAIL";

//	    try {
//	        restTemplate.postForEntity(NOTIFICATION_SERVICE_BASE, notify, Void.class);
//	    } catch (Exception e) {
//	        System.out.println("⚠️ Failed to send notification: " + e.getMessage());
//	    }

	    return mapToDTO(saved);
	}
	
	private AppointmentDTO mapToDTO(Appointment appointment) {
		AppointmentDTO dto = new AppointmentDTO();
	    dto.setId(appointment.getId());  
	    dto.setPatientId(appointment.getPatientId());
	    dto.setDoctorId(appointment.getDoctorId());
	    dto.setStatus(appointment.getStatus());
	    return dto;
	}

	public List<Appointment> getByPatient(Long patientId){
		return appointmentRepository.findByPatientId(patientId);
	}
	
	public List<Appointment> getByDoctor(Long doctorId){
		return appointmentRepository.findByDoctorId(doctorId);
	}
	
	public Appointment updateStatus(Long id, String newStatus) {
		Appointment appointment = appointmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));
		appointment.setStatus(Appointment.Status.valueOf(newStatus.toUpperCase()));
		return appointmentRepository.save(appointment);
	}
}
