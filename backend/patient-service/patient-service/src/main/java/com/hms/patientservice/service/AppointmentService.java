package com.hms.patientservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.patientservice.config.AppointmentDTO;
import com.hms.patientservice.model.Appointment;
import com.hms.patientservice.model.Patient;
import com.hms.patientservice.repository.AppointmentRepository;
import com.hms.patientservice.repository.PatientRepository;

@Service
public class AppointmentService {
	
	@Autowired
	private AppointmentRepository appointmentRepository;
	
	@Autowired
	private PatientRepository patientRepository;
	
	public Appointment create(AppointmentDTO dto) {
		Patient patient = patientRepository.findById(dto.getPatientId())
				.orElseThrow(() -> new RuntimeException("Patient not found"));
		
		Appointment appointment = new Appointment();
		appointment.setPatient(patient);
		appointment.setDoctorId(dto.getDoctorId());
		appointment.setDateTime(dto.getDateTime());
		appointment.setStatus("BOOKED");
		
		return appointmentRepository.save(appointment);
	}
	
	public List<Appointment> getByPatientId(Long patientId){
		return appointmentRepository.findAll()
				.stream()
				.filter(a -> a.getPatient().getId().equals(patientId))
				.collect(Collectors.toList());
	}
}
