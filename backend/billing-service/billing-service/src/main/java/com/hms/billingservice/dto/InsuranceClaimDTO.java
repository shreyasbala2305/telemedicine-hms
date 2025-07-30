package com.hms.billingservice.config;

import lombok.Data;

@Data
public class InsuranceClaimDTO {
	public Long patientId;
	public Long invoiceId;
	public String insurer;
}
