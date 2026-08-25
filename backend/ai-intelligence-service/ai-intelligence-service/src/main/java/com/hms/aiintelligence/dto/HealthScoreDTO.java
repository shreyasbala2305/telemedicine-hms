package com.hms.aiintelligence.dto;

import lombok.Data;

import java.util.List;

@Data
public class HealthScoreDTO {

    private Long patientId;

    private int score;

    private String category;

    private String explanation;

    private List<HealthScoreFactorDTO> factors;
}