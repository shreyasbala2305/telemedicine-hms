package com.hms.doctorservice.controller;

import java.util.List;

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

import com.hms.doctorservice.dto.DoctorDTO;
import com.hms.doctorservice.model.Doctor;
import com.hms.doctorservice.service.DoctorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/doctors")
public class DoctorController {
	
	@Autowired
	private DoctorService doctorService;
	
	@PostMapping
	public ResponseEntity<DoctorDTO> createDoctor(@Valid @RequestBody DoctorDTO dto){
		DoctorDTO created = doctorService.createDoctor(dto);
	    return new ResponseEntity<>(created, HttpStatus.CREATED);
	}
	
	@GetMapping
	public List<Doctor> getAll(){
		return doctorService.getAll();
	}
	
	@GetMapping("/{id}")
	public Doctor getDoctorById(@PathVariable Long id){
		return doctorService.getDoctorById(id);
	}
	
	@GetMapping("/speciality/{speciality}")
	public List<Doctor> getBySpeciality(@PathVariable String speciality){
		return doctorService.getDoctorsBySpeciality(speciality);
	}
	
	@PutMapping("/{id}/availability")
	public ResponseEntity<Doctor> updateAvailability(@PathVariable Long id,
			@RequestBody List<String> availability){
		return ResponseEntity.ok(doctorService.updateAvailability(id, availability));
	}
}
