package com.hms.aiintelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalHistoryDTO {

    private Integer condition_count;

    private Integer chronic_condition_count;

    private Integer medication_count;

    private Integer prescription_count;

    private Integer appointment_count;

    private Integer recent_appointment_count;
}