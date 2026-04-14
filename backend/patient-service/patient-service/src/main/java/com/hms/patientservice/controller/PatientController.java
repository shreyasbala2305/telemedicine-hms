package com.hms.patientservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	
	@PutMapping("/{id}")
	public ResponseEntity<Patient> update(
	        @PathVariable Long id,
	        @RequestBody PatientDTO dto
	) {
	    Patient updated = patientService.update(id, dto);
	    return ResponseEntity.ok(updated);
	}
	
	@GetMapping
	public ResponseEntity<Page<Patient>> getAll(
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "10") int size,
	        @RequestParam(required = false) String search
	) {
	    return ResponseEntity.ok(patientService.getAllPaged(page, size, search));
	}
	
	@GetMapping("/{id}")
	public Patient getById(@PathVariable Long id) {
        return patientService.getPatient(id);
    }

}
