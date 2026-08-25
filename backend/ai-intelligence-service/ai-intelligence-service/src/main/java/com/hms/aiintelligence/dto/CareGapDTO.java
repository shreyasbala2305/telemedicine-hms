package com.hms.aiintelligence.dto;

import lombok.Data;

@Data
public class CareGapDTO {

    private String type;

    private String description;

    private String severity;

    private String recommendedAction;
}