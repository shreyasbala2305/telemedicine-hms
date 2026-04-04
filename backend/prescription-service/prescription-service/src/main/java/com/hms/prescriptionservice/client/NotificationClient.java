package com.hms.prescriptionservice.client;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hms.prescriptionservice.config.FeignConfig;
import com.hms.prescriptionservice.dto.NotificationDTO;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "notification-service", url = "http://localhost:8087", path = "/notification", configuration = FeignConfig.class)
public interface NotificationClient {
    @PostMapping
    void send(@RequestBody NotificationDTO dto);
}