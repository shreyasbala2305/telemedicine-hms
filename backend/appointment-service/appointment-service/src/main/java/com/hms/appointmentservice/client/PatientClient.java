package com.hms.appointmentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hms.appointmentservice.dto.PatientDTO;

@FeignClient(name = "patient-service")
public interface PatientClient {
	@GetMapping("/patients/{id}")
    PatientDTO getPatientById(@PathVariable Long id);
}
