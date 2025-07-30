package com.hms.billingservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.billingservice.dto.InvoiceDTO;
import com.hms.billingservice.model.Invoice;
import com.hms.billingservice.repository.InvoiceRepository;

@Service
public class BillingService {

	@Autowired
	private InvoiceRepository invoiceRepository;
	
	public Invoice generateInvoice(InvoiceDTO dto) {
		Invoice  invoice = new Invoice();
		invoice.setPatientId(dto.getPatientId());
		invoice.setAmount(dto.getAmount());
		invoice.setStatus("PENDING");
		invoice.setGeneratedOn(LocalDateTime.now());
		return invoiceRepository.save(invoice);
	}
	
	public List<Invoice> getInvoiceByPatient(Long patientId){
		return invoiceRepository.findByPatientId(patientId);
	}
}
