package com.hms.patientservice.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "ehr_records")
public class EHRRecord {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String fileUrl;
	
	private String notes;
	
	private LocalDateTime timeStamp;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
	private Patient patient;
}
