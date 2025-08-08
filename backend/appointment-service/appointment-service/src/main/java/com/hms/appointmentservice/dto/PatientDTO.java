package com.hms.appointmentservice.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PatientDTO {
	private Long id;
    private String name;
    private String email;
    private String contact;
    private String gender;
    private LocalDate dob;
    private Long userId;
}
