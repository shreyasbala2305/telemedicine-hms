package com.hms.notificationservice.dto;

import lombok.Data;

@Data
public class MessageNotificationDTO {
	private String phoneNumber;
    private String message;
}
