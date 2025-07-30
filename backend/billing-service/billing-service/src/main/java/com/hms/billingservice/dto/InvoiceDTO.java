package com.hms.billingservice.dto;

import lombok.Data;

@Data
public class InvoiceDTO {
	public Long patientId;
	public Double amount;
}
