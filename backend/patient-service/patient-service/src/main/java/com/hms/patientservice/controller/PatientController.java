package com.hms.patientservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.patientservice.common.response.ApiResponse;
import com.hms.patientservice.dto.PatientDTO;
import com.hms.patientservice.dto.PatientResponseDTO;
import com.hms.patientservice.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/patients")
@Validated
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<PatientDTO>> create(
            @Valid @RequestBody PatientDTO dto) {

        PatientDTO created =
                patientService.create(dto);

        return new ResponseEntity<>(
                ApiResponse.success(
                        "Patient registered successfully",
                        created
                ),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody PatientDTO dto) {

        PatientResponseDTO updated =
                patientService.update(id, dto);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Patient updated successfully",
                        updated
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PatientResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Page<PatientResponseDTO> patients =
                patientService.getAllPaged(
                        page,
                        size,
                        search
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Patients fetched successfully",
                        patients
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponseDTO>> getById(
            @PathVariable Long id) {

        PatientResponseDTO patient =
                patientService.getPatient(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Patient fetched successfully",
                        patient
                )
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<PatientResponseDTO>> getByUserId(
            @PathVariable Long userId) {

        PatientResponseDTO patient =
                patientService.getByUserId(userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Patient fetched successfully",
                        patient
                )
        );
    }
}