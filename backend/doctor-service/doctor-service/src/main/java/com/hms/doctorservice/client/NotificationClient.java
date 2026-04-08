package com.hms.doctorservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hms.doctorservice.config.FeignConfig;
import com.hms.doctorservice.dto.EmailNotificationDTO;

@FeignClient(name = "notification-service", url = "http://localhost:8087", configuration = FeignConfig.class)
public interface NotificationClient {
	@PostMapping("/notifications/email")
    void sendEmail(@RequestBody EmailNotificationDTO dto);
}
