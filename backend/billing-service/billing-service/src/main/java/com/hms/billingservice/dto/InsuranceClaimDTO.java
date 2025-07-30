package com.hms.billingservice.dto;

import lombok.Data;

@Data
public class InsuranceClaimDTO {
	public Long patientId;
	public Long invoiceId;
	public String insurer;
}
