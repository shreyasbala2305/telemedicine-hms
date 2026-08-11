package com.hms.appointmentservice.exception;

public class SlotAlreadyBookedException extends RuntimeException {

    public SlotAlreadyBookedException(String message) {
        super(message);
    }
}