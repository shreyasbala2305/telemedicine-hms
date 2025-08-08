package com.hms.appointmentservice.dto;

import java.util.List;

import lombok.Data;

@Data
public class DoctorDTO {
	private Long id;
	private String name;
	private List<String> availability;
}
