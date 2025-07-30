package com.hms.appointmentservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.appointmentservice.dto.AppointmentDTO;
import com.hms.appointmentservice.model.Appointment;
import com.hms.appointmentservice.repository.AppointmentRepository;

@Service
public class AppointmentService {
	
	@Autowired
	private AppointmentRepository appointmentRepository;
	
	public Appointment bookAppointment(AppointmentDTO dto) {
		Appointment appointment = new Appointment();
		appointment.setPatientId(dto.patientId);
		appointment.setDoctorId(dto.doctorId);
		appointment.setDateTime(dto.dateTime);
		appointment.setStatus(Appointment.Status.CONFIRMED);
		return appointmentRepository.save(appointment);
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
