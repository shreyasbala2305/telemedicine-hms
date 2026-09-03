package com.hms.aiintelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiMlContributingFactorDTO {

    private String name;

    private Double value;

    private Double contribution;

    private String direction;
}