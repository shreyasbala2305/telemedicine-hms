package com.hms.billingservice.dto;

import lombok.Data;

@Data
public class EmailNotificationDTO {
	private String to;
    private String subject;
    private String body;
}
