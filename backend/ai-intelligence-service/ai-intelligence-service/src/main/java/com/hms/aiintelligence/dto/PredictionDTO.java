package com.hms.aiintelligence.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PredictionDTO {

    private Long patientId;

    private String predictionType;

    private String prediction;

    private double score;

    private double confidence;

    private String modelType;

    private String modelVersion;

    private String featureVersion;

    private List<String> contributingFactors =
            new ArrayList<>();

    private String explanation;

    private boolean fallback;

    private List<String> dataWarnings =
            new ArrayList<>();
}