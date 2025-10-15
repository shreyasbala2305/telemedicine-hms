package com.hms.patientservice.dto;

import lombok.Data;

@Data
public class NotificationDTO {
	public Long recipientId;
	public String recipientEmail;
	public String recipientContact;
	public String message;
	public String type;
}

