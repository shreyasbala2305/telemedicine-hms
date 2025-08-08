package com.hms.appointmentservice.dto;

import java.time.LocalDateTime;

import com.hms.appointmentservice.model.Appointment.Status;

import lombok.Data;

@Data
public class AppointmentDTO {
	private Long id;
	private Long patientId;
	private Long doctorId;
	private LocalDateTime dateTime;
	private Status status;
}
