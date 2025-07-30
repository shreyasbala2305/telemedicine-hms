package com.hms.billingservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.billingservice.dto.InvoiceDTO;
import com.hms.billingservice.model.Invoice;
import com.hms.billingservice.service.BillingService;

@RestController
@RequestMapping("/bills")
public class BillingController {
	
	@Autowired
	private BillingService billingService;
	
	@PostMapping
	public ResponseEntity<Invoice> create(@RequestBody InvoiceDTO dto){
		return new ResponseEntity<>(billingService.generateInvoice(dto), HttpStatus.CREATED);
	}
	
	@GetMapping("/{patientId}")
	public ResponseEntity<List<Invoice>> getByPatient(@PathVariable Long patientId){
		return ResponseEntity.ok(billingService.getInvoiceByPatient(patientId));
	}
}
