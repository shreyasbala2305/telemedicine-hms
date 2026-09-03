package com.hms.aiintelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiMlPredictionRequestDTO {

    private Long patient_id;

    private PatientFeaturesDTO features;
}