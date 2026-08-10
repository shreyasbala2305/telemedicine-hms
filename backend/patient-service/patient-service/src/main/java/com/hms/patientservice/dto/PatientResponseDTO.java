package com.hms.patientservice.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseDTO {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String contact;
    private String gender;
    private LocalDate dob;
}