package com.hms.appointmentservice.dto;

import java.time.LocalDateTime;

import com.hms.appointmentservice.model.Appointment.Status;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Data;

@Data
public class AppointmentDTO {

    private Long id;

    @NotNull(message = "Patient ID is required")
    @Positive(message = "Patient ID must be positive")
    private Long patientId;

    @NotNull(message = "Doctor ID is required")
    @Positive(message = "Doctor ID must be positive")
    private Long doctorId;

    @NotNull(message = "Appointment date and time is required")
    @Future(message = "Appointment date and time must be in the future")
    private LocalDateTime dateTime;

    private Status status;
}