package com.hms.authservice.dto;

import lombok.Data;

@Data
public class DoctorDTO {
	private Long userId;
    private String name;
    private String contact;
    private String specialty;
    private String qualification;
}
