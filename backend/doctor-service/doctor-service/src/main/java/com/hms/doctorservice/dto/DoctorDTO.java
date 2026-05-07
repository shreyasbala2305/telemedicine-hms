package com.hms.doctorservice.dto;

import java.util.List;

import lombok.Data;

@Data
public class DoctorDTO {
	private Long id;
	private String name;
	private String email;
	private String contact;
	private String speciality;
	private String qualification;
	private Long userId;
	private List<String> availability;
}
