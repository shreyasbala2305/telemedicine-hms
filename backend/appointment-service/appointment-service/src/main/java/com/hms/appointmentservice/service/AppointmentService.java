package com.hms.appointmentservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hms.appointmentservice.dto.AppointmentDTO;
import com.hms.appointmentservice.dto.DoctorDTO;
import com.hms.appointmentservice.dto.NotificationDTO;
import com.hms.appointmentservice.dto.PatientDTO;
import com.hms.appointmentservice.model.Appointment;
import com.hms.appointmentservice.repository.AppointmentRepository;

@Service
public class AppointmentService {
	
	@Autowired
	private AppointmentRepository appointmentRepository;
	
	@Autowired
    private RestTemplate restTemplate;

    private final String PATIENT_SERVICE_BASE = "http://localhost:8082/patients/";
    private final String DOCTOR_SERVICE_BASE = "http://localhost:8084/doctors/";
    private final String NOTIFICATION_SERVICE_BASE = "http://localhost:8086/notify";

	
	public Appointment bookAppointment(AppointmentDTO dto) {
		
		// Validate patient exists
        try {
            restTemplate.getForObject(PATIENT_SERVICE_BASE + dto.patientId, PatientDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Patient not found");
        }

        // Validate doctor exists
        try {
            restTemplate.getForObject(DOCTOR_SERVICE_BASE + dto.doctorId, DoctorDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Doctor not found");
        }
		
		Appointment appointment = new Appointment();
		appointment.setPatientId(dto.patientId);
		appointment.setDoctorId(dto.doctorId);
		appointment.setDateTime(dto.dateTime);
		appointment.setStatus(Appointment.Status.PENDING);
		Appointment saved = appointmentRepository.save(appointment);
		
		
		NotificationDTO notify = new NotificationDTO();
	    notify.recipientId = dto.patientId;
	    notify.message = "Your appointment has been booked for " + dto.dateTime;
	    notify.type = "EMAIL";

	    try {
	        restTemplate.postForEntity(NOTIFICATION_SERVICE_BASE, notify, Void.class);
	    } catch (Exception e) {
	        System.out.println("⚠️ Failed to send notification: " + e.getMessage());
	    }

	    return saved;
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
