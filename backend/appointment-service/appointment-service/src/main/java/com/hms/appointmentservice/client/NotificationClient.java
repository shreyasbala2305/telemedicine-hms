package com.hms.appointmentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hms.appointmentservice.dto.EmailNotificationDTO;
import com.hms.appointmentservice.dto.MessageNotificationDTO;
import com.hms.appointmentservice.dto.NotificationDTO;

@FeignClient(name = "notification-service")
public interface NotificationClient {
	@PostMapping("/notifications")
	void send(@RequestBody NotificationDTO dto);
	
	@PostMapping("/notifications/message")
    void sendMessage(@RequestBody MessageNotificationDTO dto);
	
	@PostMapping("/notifications/email")
    void sendEmail(@RequestBody EmailNotificationDTO dto);
}
