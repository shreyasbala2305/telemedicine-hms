package com.hms.prescriptionservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.prescriptionservice.dto.PrescriptionDTO;
import com.hms.prescriptionservice.service.PrescriptionService;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController {

    private final PrescriptionService service;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PrescriptionDTO> create(@RequestBody PrescriptionDTO dto) {
        PrescriptionDTO created = service.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public PrescriptionDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<PrescriptionDTO> getByPatient(@PathVariable Long patientId) {
        return service.getByPatient(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<PrescriptionDTO> getByDoctor(@PathVariable Long doctorId) {
        return service.getByDoctor(doctorId);
    }
    
    @GetMapping
    public List<PrescriptionDTO> search(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId
    ) {
        if (patientId != null) return service.getByPatient(patientId);
        if (doctorId != null) return service.getByDoctor(doctorId);
        return List.of();
    }

}
