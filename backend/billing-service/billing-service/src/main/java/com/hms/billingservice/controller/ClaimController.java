package com.hms.billingservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.billingservice.dto.InsuranceClaimDTO;
import com.hms.billingservice.model.InsuranceClaim;
import com.hms.billingservice.service.InsuranceClaimService;

@RestController
@RequestMapping("/claims")
public class ClaimController {

	@Autowired
	private InsuranceClaimService insureanClaimService;
	
	@PostMapping
	public ResponseEntity<InsuranceClaim> submit(@RequestBody InsuranceClaimDTO dto){
		return new ResponseEntity<>(insureanClaimService.submitClaim(dto), HttpStatus.CREATED);
	}
}
