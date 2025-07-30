package com.hms.appointmentservice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.appointmentservice.dto.AppointmentDTO;
import com.hms.appointmentservice.model.Appointment;
import com.hms.appointmentservice.service.AppointmentService;

@RestController
@RequestMapping("/appointmnets")
public class AppointmentController {

	@Autowired
	private AppointmentService appointmentService;
	
	@PostMapping
	public ResponseEntity<Appointment> bookAppointment(@RequestBody AppointmentDTO dto){
		return new ResponseEntity<>(appointmentService.bookAppointment(dto), HttpStatus.CREATED);
	}
	
	@GetMapping("patient/{id}")
	public List<Appointment> getByPatient(@PathVariable Long patientId){
		return appointmentService.getByPatient(patientId);
	}
	
	@GetMapping("doctor/{id}")
	public List<Appointment> getByDoctor(@PathVariable Long doctorId){
		return appointmentService.getByDoctor(doctorId);
	}
	
	@PutMapping("/{id}/status")
	public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body){
		return ResponseEntity.ok(appointmentService.updateStatus(id, body.get("status")));
	}
}
