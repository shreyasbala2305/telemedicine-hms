package com.hms.authservice.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PatientDTO {
	private Long userId;
    private String name;
    private String email;
    private String contact;
    private String gender;
    private LocalDate dob;
}
