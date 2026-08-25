package com.hms.aiintelligence.dto;

import lombok.Data;

import java.util.List;

@Data
public class HealthInsightDTO {

    private String type;

    private String title;

    private String description;

    private String severity;

    private List<String> evidence;

    private String recommendation;
}