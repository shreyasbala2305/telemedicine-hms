package com.hms.prescriptionservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "prescriptions")
@Data
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appointmentId;   // optional
    private Long patientId;
    private Long doctorId;

    @Column(columnDefinition = "text")
    private String symptoms;

    @Column(columnDefinition = "text")
    private String diagnosis;

    @Column(columnDefinition = "text")
    private String medicinesJson; // JSON list of medicines

    private String followUpDate;  // ISO date string (e.g. "2025-10-01")

    @Column(columnDefinition = "text")
    private String notes;
}
