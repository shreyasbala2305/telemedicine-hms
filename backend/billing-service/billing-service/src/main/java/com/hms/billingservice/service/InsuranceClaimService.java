package com.hms.billingservice.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.billingservice.config.InsuranceClaimDTO;
import com.hms.billingservice.model.InsuranceClaim;
import com.hms.billingservice.model.Invoice;
import com.hms.billingservice.repository.InsuranceClaimRepository;
import com.hms.billingservice.repository.InvoiceRepository;

@Service
public class InsuranceClaimService {

	@Autowired
	private InvoiceRepository invoiceRepository;
	
	@Autowired
	private InsuranceClaimRepository insuranceClaimRepository;
	
	public InsuranceClaim submitClaim(InsuranceClaimDTO dto) {
		Invoice invoice = invoiceRepository.findById(dto.invoiceId)
				.orElseThrow(() -> new RuntimeException("Invoice not found"));
		
		InsuranceClaim insuranceClaim = new InsuranceClaim();
		insuranceClaim.setPatientId(dto.getPatientId());
		insuranceClaim.setInvoiceId(dto.getInvoiceId());
		insuranceClaim.setInsurer(dto.getInsurer());
		insuranceClaim.setClaimStatus("SUBMITTED");
		insuranceClaim.setSubmittedAt(LocalDateTime.now());
		
		return insuranceClaimRepository.save(insuranceClaim);
	}
}
