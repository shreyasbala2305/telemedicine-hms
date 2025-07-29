package com.hms.patientservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.patientservice.config.AppointmentDTO;
import com.hms.patientservice.model.Appointment;
import com.hms.patientservice.service.AppointmentService;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

	@Autowired
	private AppointmentService appointmentService;
	
	@PostMapping
	public ResponseEntity<Appointment> book(@RequestBody AppointmentDTO dto){
		return new ResponseEntity<>(appointmentService.create(dto), HttpStatus.CREATED);
	}
	
	@GetMapping("/patient/{patienId}")
	public ResponseEntity<List<Appointment>> getByPatient(@PathVariable Long patientId){
		return ResponseEntity.ok(appointmentService.getByPatientId(patientId));
	}
}
