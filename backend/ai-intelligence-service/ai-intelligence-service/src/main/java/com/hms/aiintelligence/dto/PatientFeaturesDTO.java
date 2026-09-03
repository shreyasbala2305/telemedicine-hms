package com.hms.aiintelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientFeaturesDTO {

    private Integer age;

    private String gender;

    private ClinicalHistoryDTO clinical_history;

    private TemporalFeaturesDTO temporal_features;

    private Integer active_medication_count;

    private Integer specialist_visit_count;

    private Integer symptom_count;

    private Integer recurring_symptom_count;
}