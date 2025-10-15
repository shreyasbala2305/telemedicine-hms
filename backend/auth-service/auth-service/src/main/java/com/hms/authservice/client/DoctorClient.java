package com.hms.authservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hms.authservice.dto.DoctorDTO;

@FeignClient(name = "doctor-service")
public interface DoctorClient {
    @PostMapping("/doctors/register")
    void createDoctor(@RequestBody DoctorDTO doctorDTO);
}