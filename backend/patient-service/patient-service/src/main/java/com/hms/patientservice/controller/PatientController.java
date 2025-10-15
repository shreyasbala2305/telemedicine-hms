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

import com.hms.patientservice.dto.PatientDTO;
import com.hms.patientservice.model.Patient;
import com.hms.patientservice.service.PatientService;

@RestController
@RequestMapping("/patients")
public class PatientController {
	
	@Autowired
	private PatientService patientService;
	
	@PostMapping("/register")
	public ResponseEntity<PatientDTO> create(@RequestBody PatientDTO dto){
		PatientDTO created = patientService.create(dto);
		return new ResponseEntity<>(created, HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<Patient>> getAll(){
		return ResponseEntity.ok(patientService.getAll());
	}
	
	@GetMapping("/{id}")
	public Patient getById(@PathVariable Long id) {
        return patientService.getPatient(id);
    }

}
