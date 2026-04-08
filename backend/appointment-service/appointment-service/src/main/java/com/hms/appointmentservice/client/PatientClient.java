package com.hms.appointmentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hms.appointmentservice.config.FeignConfig;
import com.hms.appointmentservice.dto.PatientDTO;

@FeignClient(name = "patient-service", url = "http://localhost:8082", configuration = FeignConfig.class)
public interface PatientClient {
	@GetMapping("/patients/{id}")
    PatientDTO getPatientById(@PathVariable Long id);
}
