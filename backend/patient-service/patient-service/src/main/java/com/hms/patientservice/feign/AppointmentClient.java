package com.hms.patientservice.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hms.patientservice.dto.AppointmentDTO;

@FeignClient(name = "appointment-service")
public interface AppointmentClient {
	@GetMapping("/appointments/patient/{id}")
    List<AppointmentDTO> getAppointmentsByPatient(@PathVariable Long id);
}
