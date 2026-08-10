package com.hms.patientservice.dto;

import lombok.Data;

@Data
public class AuthResponse {

    private Long id;
    private String email;
    private String fullName;
    private String role;
}