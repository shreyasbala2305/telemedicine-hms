package com.hms.prescriptionservice.dto;

import lombok.Data;

@Data
public class NotificationDTO {
    private Long recipientId;        // patient id
    private String recipientEmail;   // patient email
    private String recipientContact; // patient phone (with +91 if needed)
    private String message;
    private String type;             // "EMAIL" or "SMS"
}