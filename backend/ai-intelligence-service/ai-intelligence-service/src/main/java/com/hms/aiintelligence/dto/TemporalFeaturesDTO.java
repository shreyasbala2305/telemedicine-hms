package com.hms.aiintelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemporalFeaturesDTO {

    private Integer days_since_last_appointment;

    private Integer appointments_last_30_days;

    private Integer appointments_last_90_days;

    private Integer prescriptions_last_90_days;
}