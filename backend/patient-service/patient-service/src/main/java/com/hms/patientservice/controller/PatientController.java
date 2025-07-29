package com.hms.patientservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.patientservice.config.PatientDTO;
import com.hms.patientservice.model.Patient;
import com.hms.patientservice.service.PatientService;

@RestController
@RequestMapping("/patients")
public class PatientController {
	
	@Autowired
	private PatientService patientService;
	
	@PostMapping
	public ResponseEntity<Patient> create(@RequestBody PatientDTO dto){
		return new ResponseEntity<>(patientService.create(dto), HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<Patient>> getAll(){
		return ResponseEntity.ok(patientService.getAll());
	}

}
