package com.hms.appointmentservice.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.appointmentservice.common.response.ApiResponse;
import com.hms.appointmentservice.dto.AppointmentDTO;
import com.hms.appointmentservice.dto.AppointmentResponseDTO;
import com.hms.appointmentservice.service.AppointmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> bookAppointment(
            @Valid @RequestBody AppointmentDTO dto) {

        AppointmentResponseDTO booked =
                appointmentService.bookAppointment(dto);

        return new ResponseEntity<>(
                ApiResponse.success(
                        "Appointment booked successfully",
                        booked
                ),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getByPatient(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Patient appointments fetched successfully",
                        appointmentService.getByPatient(patientId)
                )
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getByDoctor(
            @PathVariable Long doctorId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Doctor appointments fetched successfully",
                        appointmentService.getByDoctor(doctorId)
                )
        );
    }

    @PreAuthorize("hasRole('RECEPTIONIST')")
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Appointment status updated successfully",
                        appointmentService.updateStatus(
                                id,
                                body.get("status")
                        )
                )
        );
    }

    @GetMapping("/doctor/{doctorId}/range")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getByDoctorAndRange(
            @PathVariable Long doctorId,
            @RequestParam("start") String start,
            @RequestParam("end") String end) {

        LocalDateTime startDt =
                LocalDateTime.parse(start);

        LocalDateTime endDt =
                LocalDateTime.parse(end);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Appointments fetched successfully",
                        appointmentService.getByDoctorAndRange(
                                doctorId,
                                startDt,
                                endDt
                        )
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AppointmentResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Appointments fetched successfully",
                        appointmentService.getAllPaged(page, size)
                )
        );
    }

    @GetMapping("/doctor/{doctorId}/slots")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam String date) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Available slots fetched successfully",
                        appointmentService.getAvailableSlots(
                                doctorId,
                                date
                        )
                )
        );
    }
}