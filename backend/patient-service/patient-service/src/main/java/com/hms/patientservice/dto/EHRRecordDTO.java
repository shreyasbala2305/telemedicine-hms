package com.hms.patientservice.dto;

import lombok.Data;

@Data
public class EHRRecordDTO {
	private String fileUrl;
    private String notes;
    private Long patientId;
}
