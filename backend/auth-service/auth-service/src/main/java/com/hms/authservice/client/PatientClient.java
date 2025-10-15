package com.hms.authservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hms.authservice.dto.PatientDTO;

@FeignClient(name = "patient-service")
public interface PatientClient {
    @PostMapping("/patients/register")
    void createPatient(@RequestBody PatientDTO patientDTO);
}
