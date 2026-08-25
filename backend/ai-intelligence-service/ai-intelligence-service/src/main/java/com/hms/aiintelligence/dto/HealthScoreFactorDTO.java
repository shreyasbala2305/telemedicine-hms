package com.hms.aiintelligence.dto;

import lombok.Data;

@Data
public class HealthScoreFactorDTO {

    private String factor;

    private int impact;

    private String direction;

    private String explanation;

    private String evidence;
}