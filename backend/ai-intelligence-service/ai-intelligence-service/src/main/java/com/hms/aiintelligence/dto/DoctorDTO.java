package com.hms.aiintelligence.dto;

import lombok.Data;

@Data
public class DoctorDTO {

    private Long id;

    private Long userId;

    private String name;

    private String email;

    private String contact;

    private String speciality;

    private String qualification;
}