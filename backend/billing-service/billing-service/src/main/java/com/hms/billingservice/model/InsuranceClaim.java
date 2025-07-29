package com.hms.billingservice.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "insurance_claim")
public class InsuranceClaim {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "patient_id")
    private Long patientId;
    private Long invoiceId;

    private String insurer;
    private String claimStatus; 
    private LocalDateTime submittedAt;
}
