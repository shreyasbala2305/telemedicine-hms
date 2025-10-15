package com.hms.authservice.dto;

import java.time.LocalDate;

import com.hms.authservice.model.Role;

import lombok.Data;

@Data
public class RegisterRequest {
	private String name;
    private String email;
    private String password;
    private Role role;

    private String contact;
    
    // for patients
    private LocalDate dob;
    private String gender;

    // for doctors
    private String specialty;
    private String qualification;
}
