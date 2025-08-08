package com.hms.patientservice.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AppointmentDTO {
	private Long patientId;
	private Long doctorId;
	private LocalDateTime dateTime;
	private String status;
}
