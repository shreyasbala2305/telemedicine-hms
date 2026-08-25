package com.hms.aiintelligence.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDTO {

    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime dateTime;
    private String status;
}