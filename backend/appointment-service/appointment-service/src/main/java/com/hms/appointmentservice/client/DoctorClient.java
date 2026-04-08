package com.hms.appointmentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hms.appointmentservice.config.FeignConfig;
import com.hms.appointmentservice.dto.DoctorDTO;

@FeignClient(name = "doctor-service", url = "http://localhost:8083", configuration = FeignConfig.class)
public interface DoctorClient {
	@GetMapping("/doctors/{id}")
    DoctorDTO getDoctorById(@PathVariable Long id);
}
