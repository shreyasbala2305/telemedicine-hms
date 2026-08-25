package com.hms.aiintelligence.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientDTO {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String contact;
    private String gender;
    private LocalDate dob;
}