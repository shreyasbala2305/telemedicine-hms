package com.hms.prescriptionservice.client;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hms.prescriptionservice.config.FeignConfig;
import com.hms.prescriptionservice.dto.DoctorDTO;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "doctor-service", url = "http://localhost:8083", path = "/doctors", configuration = FeignConfig.class)
public interface DoctorClient {
    @GetMapping("/{id}")
    DoctorDTO getDoctorById(@PathVariable("id") Long id);
}
