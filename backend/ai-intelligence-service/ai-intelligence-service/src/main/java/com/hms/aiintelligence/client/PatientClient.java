package com.hms.aiintelligence.client;

import com.hms.aiintelligence.config.FeignConfig;
import com.hms.aiintelligence.dto.PatientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "patient-service",
        path = "/patients",
        configuration = FeignConfig.class
)
public interface PatientClient {

    @GetMapping("/{id}")
    PatientDTO getPatientById(
            @PathVariable("id") Long id
    );
}