package com.hms.patientservice.dto;

import lombok.Data;

@Data
public class MessageNotificationDTO {
	private String phoneNumber;
    private String message;
}
