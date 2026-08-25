package com.hms.aiintelligence.dto;

import lombok.Data;

import java.util.List;

@Data
public class AppointmentPageDTO {

    private List<AppointmentDTO> content;

    private int totalPages;
    private long totalElements;
    private int number;
    private int size;
}