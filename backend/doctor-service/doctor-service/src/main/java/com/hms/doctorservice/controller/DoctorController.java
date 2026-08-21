package com.hms.doctorservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
import org.springframework.security.access.prepost.PreAuthorize;

import com.hms.doctorservice.common.response.ApiResponse;
import com.hms.doctorservice.dto.DoctorDTO;
import com.hms.doctorservice.dto.DoctorResponseDTO;
import com.hms.doctorservice.service.DoctorService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;

@RestController
@RequestMapping("/doctors")
@Validated
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody DoctorDTO dto) {

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
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<DoctorResponseDTO>>> getAll(
            @PageableDefault(
                    size = 10,
                    sort = "name"
            )
            Pageable pageable,
            @RequestParam(required = false) String speciality) {

        Page<DoctorResponseDTO> doctors =
                doctorService.getAll(
                        pageable,
                        speciality
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Doctors fetched successfully",
                        doctors
                )
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'RECEPTIONIST', 'ADMIN')")
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
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
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

//    @GetMapping("/speciality/{speciality}")
//    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getBySpeciality(
//            @PathVariable String speciality) {
//
//        List<DoctorResponseDTO> doctors =
//                doctorService.getDoctorsBySpeciality(speciality);
//
//        return ResponseEntity.ok(
//                ApiResponse.success(
//                        "Doctors fetched successfully",
//                        doctors
//                )
//        );
//    }

    @PutMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> updateAvailability(
            @PathVariable Long id,
            @Valid @RequestBody List<@Pattern(
                regexp = "^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\\s\\d{2}:\\d{2}-\\d{2}:\\d{2}$",
                message = "Availability must be in format 'Day HH:MM-HH:MM'"
            ) String> availability) {

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