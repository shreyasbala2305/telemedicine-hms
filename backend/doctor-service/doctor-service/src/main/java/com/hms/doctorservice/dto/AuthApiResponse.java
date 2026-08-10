package com.hms.doctorservice.dto;

import lombok.Data;

@Data
public class AuthApiResponse {

    private boolean success;
    private String message;
    private AuthResponse data;
    private String timestamp;
}