package com.hms.billingservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hms.billingservice.dto.PatientDTO;

@FeignClient(name = "patient-service")
public interface PatientClient {
	@GetMapping("/patients/{id}")
    PatientDTO getPatientById(@PathVariable Long id);
}
