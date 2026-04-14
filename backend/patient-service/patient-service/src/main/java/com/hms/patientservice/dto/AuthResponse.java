package com.hms.patientservice.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private Long userId;
    private String token;
}