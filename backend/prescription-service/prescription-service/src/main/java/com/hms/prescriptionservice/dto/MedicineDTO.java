package com.hms.prescriptionservice.dto;

import lombok.Data;

@Data
public class MedicineDTO {
    private String name;
    private String dose;      // "500mg", "1 tablet"
    private String frequency; // "2x/day"
    private String duration;  // "5 days"
}
