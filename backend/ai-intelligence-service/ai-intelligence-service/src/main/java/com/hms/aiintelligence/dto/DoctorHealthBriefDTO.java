package com.hms.aiintelligence.dto;

import lombok.Data;

import java.util.List;

@Data
public class DoctorHealthBriefDTO {

    private Long patientId;

    private String patientName;

    private String summary;

    private List<HealthTrendDTO> importantTrends;

    private List<CareGapDTO> careGaps;

    private List<HealthInsightDTO> attentionPoints;

    private List<String> recentDiagnoses;

    private List<String> currentMedications;

    private List<String> recentSymptoms;
}