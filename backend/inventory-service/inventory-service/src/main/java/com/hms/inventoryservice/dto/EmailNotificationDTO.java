package com.hms.inventoryservice.dto;

import lombok.Data;

@Data
public class EmailNotificationDTO {
	private String to;
    private String subject;
    private String body;
}
