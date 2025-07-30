package com.hms.patientservice.dto;

import lombok.Data;

@Data
public class UserDTO {
	private String name;
	private String email;
	private String password;
	public String role;
}
