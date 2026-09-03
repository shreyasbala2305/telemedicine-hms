package com.hms.aiintelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiMlPredictionResponseDTO {

    private Long patient_id;

    private String prediction;

    private Double confidence;

    private String model_version;

    private List<AiMlContributingFactorDTO> contributing_factors;

    private String disclaimer;
}