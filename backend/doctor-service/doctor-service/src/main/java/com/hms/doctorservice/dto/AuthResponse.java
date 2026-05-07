package com.hms.doctorservice.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private Long id;
    private String token;
    public Long getUserId() {
        return id; // map id → userId
    }
}