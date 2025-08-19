package com.hms.doctorservice.exception;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorResponse {
	private String message;
    private String details;
    private int status;
    private LocalDateTime timestamp;

    public ErrorResponse(String message, String details, int status) {
        this.message = message;
        this.details = details;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }
}
