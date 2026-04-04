package com.hms.prescriptionservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hms.prescriptionservice.config.FeignConfig;
import com.hms.prescriptionservice.dto.PatientDTO;

@FeignClient(name = "patient-service", url = "http://localhost:8082", path = "/patients", configuration = FeignConfig.class)
public interface PatientClient {
    @GetMapping("/{id}")
    PatientDTO getPatientById(@PathVariable("id") Long id);
}