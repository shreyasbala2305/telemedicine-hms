package com.hms.inventoryservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hms.inventoryservice.dto.EmailNotificationDTO;

@FeignClient(name = "notification-service", url = "http://localhost:8087")
public interface NotificationClient {
	@PostMapping("/notifications/email")
    void sendEmail(@RequestBody EmailNotificationDTO dto);
}
