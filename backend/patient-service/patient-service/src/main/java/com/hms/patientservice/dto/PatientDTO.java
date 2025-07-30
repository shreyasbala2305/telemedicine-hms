package com.hms.patientservice.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PatientDTO {
	private Long userId;
	private LocalDate dbo;
	private String gender;
	private String contact;
}
