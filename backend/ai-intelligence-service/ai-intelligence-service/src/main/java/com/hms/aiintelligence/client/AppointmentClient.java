package com.hms.aiintelligence.client;

import com.hms.aiintelligence.config.FeignConfig;
import com.hms.aiintelligence.dto.AppointmentPageDTO;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "appointment-service",
        path = "/appointments",
        configuration = FeignConfig.class
)
public interface AppointmentClient {

    @GetMapping("/patient/{patientId}")
    AppointmentPageDTO getAppointmentsByPatient(
            @PathVariable("patientId") Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size
    );
}