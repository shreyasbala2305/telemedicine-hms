package com.hms.aiintelligence.dto;

import lombok.Data;

import java.util.List;

@Data
public class PrescriptionDTO {

    private Long id;
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;

    private String symptoms;
    private String diagnosis;

    private List<MedicineDTO> medicines;

    private String followUpDate;
    private String notes;
}