package com.hms.appointmentservice.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "appointments")
public class Appointment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private Long patientId;
	
	private Long doctorId;
	
	private LocalDateTime dateTime;
	
	@Enumerated(EnumType.STRING)
	private Status status;
	
	public enum Status{
		PENDING, 
		CONFIRMED,
		CANCELLED
	}
	
}

