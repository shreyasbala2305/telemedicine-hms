package com.hms.aiintelligence.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class HealthTimelineEventDTO {

    private LocalDateTime timestamp;

    private String eventType;

    private String title;

    private String description;

    private List<String> symptoms;

    private List<String> diagnoses;

    private List<String> medications;

    private Long appointmentId;

    private Long prescriptionId;
}