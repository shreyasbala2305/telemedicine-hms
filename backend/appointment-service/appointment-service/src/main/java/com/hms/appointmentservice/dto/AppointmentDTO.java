package com.hms.appointmentservice.dto;

import java.time.LocalDateTime;

public class AppointmentDTO {
	public Long patientId;
	public Long doctorId;
	public LocalDateTime dateTime;
	public String status;
}
