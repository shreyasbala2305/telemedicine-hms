package com.hms.aiintelligence.client;

import com.hms.aiintelligence.config.FeignConfig;
import com.hms.aiintelligence.dto.PrescriptionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
        name = "prescription-service",
        path = "/prescriptions",
        configuration = FeignConfig.class
)
public interface PrescriptionClient {

    @GetMapping("/patient/{patientId}")
    List<PrescriptionDTO> getPrescriptionsByPatient(
            @PathVariable("patientId") Long patientId
    );
}