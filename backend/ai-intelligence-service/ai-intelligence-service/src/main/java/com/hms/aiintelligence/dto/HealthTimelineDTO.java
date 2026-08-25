package com.hms.aiintelligence.dto;

import lombok.Data;

import java.util.List;

@Data
public class HealthTimelineDTO {

    private Long patientId;

    private String patientName;

    private List<HealthTimelineEventDTO> events;

    private int totalEvents;

    private String earliestEvent;

    private String latestEvent;
}