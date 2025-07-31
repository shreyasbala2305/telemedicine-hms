package com.hms.patientservice.dto;

import java.time.LocalDate;

import lombok.Data;

public class PatientDTO {
	public Long id;
    public String name;
    public String contact;
    public String gender;
    public LocalDate dob;
    public Long userId;
}
