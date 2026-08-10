package com.hms.doctorservice.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String contact;
    private String speciality;
    private String qualification;
    private Long userId;
    private List<String> availability;
}