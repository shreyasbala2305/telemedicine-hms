package com.hms.appointmentservice.dto;

import java.time.LocalDateTime;

import com.hms.appointmentservice.model.Appointment.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDTO {

    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime dateTime;
    private Status status;
}