package com.hms.appointmentservice.exception;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        List<ApiError> errors =
                ex.getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .map(this::mapFieldError)
                        .toList();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                    ErrorResponse.of(
                        "Validation failed",
                        errors
                    )
                );
    }

    @ExceptionHandler(AppointmentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAppointmentNotFound(
            AppointmentNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                    ErrorResponse.of(
                        ex.getMessage(),
                        List.of()
                    )
                );
    }

    @ExceptionHandler(SlotAlreadyBookedException.class)
    public ResponseEntity<ErrorResponse> handleSlotConflict(
            SlotAlreadyBookedException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(
                    ErrorResponse.of(
                        ex.getMessage(),
                        List.of()
                    )
                );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                    ErrorResponse.of(
                        ex.getMessage() != null
                                ? ex.getMessage()
                                : "Invalid request",
                        List.of()
                    )
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(
            Exception ex) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(
                    ErrorResponse.of(
                        "An unexpected error occurred",
                        List.of()
                    )
                );
    }

    private ApiError mapFieldError(FieldError error) {

        return new ApiError(
                error.getField(),
                error.getDefaultMessage()
        );
    }
}