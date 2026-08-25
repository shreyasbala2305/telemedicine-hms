package com.hms.aiintelligence.service;

import com.hms.aiintelligence.dto.HealthTimelineDTO;
import com.hms.aiintelligence.dto.HealthTimelineEventDTO;
import com.hms.aiintelligence.dto.HealthTrendDTO;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class TemporalHealthAnalyzer {

    public List<HealthTrendDTO> analyze(
            HealthTimelineDTO timeline) {

        Map<String, Integer> diagnosisFrequency =
                new HashMap<>();

        Map<String, LocalDateTime> latestOccurrence =
                new HashMap<>();

        for (HealthTimelineEventDTO event :
                timeline.getEvents()) {

            if (event.getDiagnoses() == null) {
                continue;
            }

            for (String diagnosis :
                    event.getDiagnoses()) {

                if (diagnosis == null
                        || diagnosis.isBlank()) {
                    continue;
                }

                String normalized =
                        diagnosis.trim()
                                .toLowerCase();

                diagnosisFrequency.merge(
                        normalized,
                        1,
                        Integer::sum
                );

                LocalDateTime previous =
                        latestOccurrence.get(
                                normalized
                        );

                if (previous == null
                        || event.getTimestamp()
                                .isAfter(previous)) {

                    latestOccurrence.put(
                            normalized,
                            event.getTimestamp()
                    );
                }
            }
        }

        return diagnosisFrequency.entrySet()
                .stream()
                .filter(
                        entry ->
                                entry.getValue() >= 2
                )
                .map(entry -> {

                    String diagnosis =
                            entry.getKey();

                    int frequency =
                            entry.getValue();

                    LocalDateTime latest =
                            latestOccurrence.get(
                                    diagnosis
                            );

                    long daysSince =
                            latest == null
                                    || latest.equals(
                                            LocalDateTime.MIN
                                    )
                                    ? -1
                                    : ChronoUnit.DAYS.between(
                                            latest,
                                            LocalDateTime.now()
                                    );

                    HealthTrendDTO trend =
                            new HealthTrendDTO();

                    trend.setCategory(
                            "TEMPORAL_RECURRING_PATTERN"
                    );

                    trend.setDescription(
                            "The clinical pattern '" +
                            diagnosis +
                            "' has appeared repeatedly in the patient's recorded history."
                    );

                    trend.setOccurrenceCount(
                            frequency
                    );

                    trend.setSeverity(
                            determineSeverity(
                                    frequency,
                                    daysSince
                            )
                    );

                    trend.setEvidence(
                            List.of(
                                    "Occurrences: " +
                                    frequency,
                                    "Days since latest recorded occurrence: " +
                                    daysSince
                            )
                    );

                    return trend;

                })
                .toList();
    }

    private String determineSeverity(
            int frequency,
            long daysSince) {

        if (frequency >= 4
                && daysSince >= 0
                && daysSince <= 90) {

            return "HIGH";
        }

        if (frequency >= 3) {
            return "MEDIUM";
        }

        return "LOW";
    }
}