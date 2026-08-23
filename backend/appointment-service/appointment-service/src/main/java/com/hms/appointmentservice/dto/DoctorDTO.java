package com.hms.appointmentservice.dto;

import java.util.List;

import lombok.Data;

@Data
public class DoctorDTO {
    private Long id;
    private String name;
    private Long userId;
    private List<String> availability;
}