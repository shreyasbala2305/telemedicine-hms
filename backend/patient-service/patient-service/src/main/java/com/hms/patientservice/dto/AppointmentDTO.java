package com.hms.patientservice.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AppointmentDTO {
	private Long patientId;
	private LocalDateTime dateTime;
	private Long doctorId;
}
