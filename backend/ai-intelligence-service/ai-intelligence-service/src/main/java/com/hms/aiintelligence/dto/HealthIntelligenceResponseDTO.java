package com.hms.aiintelligence.dto;

import lombok.Data;

import java.util.List;

@Data
public class HealthIntelligenceResponseDTO {

    private Long patientId;

    private String patientName;

    private String generatedAt;

    private PatientHealthContextDTO context;

    private HealthScoreDTO healthScore;

    private List<HealthTrendDTO> trends;

    private List<CareGapDTO> careGaps;

    private List<HealthInsightDTO> insights;
}