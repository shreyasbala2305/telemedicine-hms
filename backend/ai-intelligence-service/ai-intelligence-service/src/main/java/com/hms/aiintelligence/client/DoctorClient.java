package com.hms.aiintelligence.client;

import com.hms.aiintelligence.config.FeignConfig;
import com.hms.aiintelligence.dto.DoctorDTO;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "doctor-service",
        path = "/doctors",
        configuration = FeignConfig.class
)
public interface DoctorClient {

    @GetMapping("/{id}")
    DoctorDTO getDoctorById(
            @PathVariable("id") Long id
    );
}