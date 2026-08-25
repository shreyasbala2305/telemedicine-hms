package com.hms.aiintelligence.dto;

import lombok.Data;

import java.util.List;

@Data
public class HealthTrendDTO {

    private String category;

    private String description;

    private String severity;

    private int occurrenceCount;

    private List<String> evidence;
}