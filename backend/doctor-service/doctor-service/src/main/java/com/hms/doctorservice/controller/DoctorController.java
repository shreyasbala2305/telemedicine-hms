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

import com.hms.doctorservice.common.response.ApiResponse;
import com.hms.doctorservice.dto.DoctorDTO;
import com.hms.doctorservice.dto.DoctorResponseDTO;
import com.hms.doctorservice.service.DoctorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> createDoctor(
            @Valid @RequestBody DoctorDTO dto) {

        DoctorResponseDTO created =
                doctorService.createDoctor(dto);

        return new ResponseEntity<>(
                ApiResponse.success(
                        "Doctor registered successfully",
                        created
                ),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> update(
            @PathVariable Long id,
            @RequestBody DoctorDTO dto) {

        DoctorResponseDTO updated =
                doctorService.update(id, dto);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Doctor updated successfully",
                        updated
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getAll() {

        List<DoctorResponseDTO> doctors =
                doctorService.getAll();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Doctors fetched successfully",
                        doctors
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> getDoctorById(
            @PathVariable Long id) {

        DoctorResponseDTO doctor =
                doctorService.getDoctorById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Doctor fetched successfully",
                        doctor
                )
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> getByUserId(
            @PathVariable Long userId) {

        DoctorResponseDTO doctor =
                doctorService.getByUserId(userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Doctor fetched successfully",
                        doctor
                )
        );
    }

    @GetMapping("/speciality/{speciality}")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getBySpeciality(
            @PathVariable String speciality) {

        List<DoctorResponseDTO> doctors =
                doctorService.getDoctorsBySpeciality(speciality);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Doctors fetched successfully",
                        doctors
                )
        );
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> updateAvailability(
            @PathVariable Long id,
            @RequestBody List<String> availability) {

        DoctorResponseDTO updated =
                doctorService.updateAvailability(
                        id,
                        availability
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Doctor availability updated successfully",
                        updated
                )
        );
    }
}