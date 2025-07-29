package com.hms.billingservice.config;

import lombok.Data;

@Data
public class InvoiceDTO {
	public Long patientId;
	public Double amount;
}
