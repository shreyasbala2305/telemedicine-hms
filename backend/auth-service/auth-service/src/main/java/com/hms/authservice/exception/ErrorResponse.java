package com.hms.authservice.exception;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

    private boolean success;
    private String message;
    private List<ApiError> errors;
    private LocalDateTime timestamp;

    public static ErrorResponse of(
            String message,
            List<ApiError> errors) {

        return new ErrorResponse(
                false,
                message,
                errors,
                LocalDateTime.now()
        );
    }
}