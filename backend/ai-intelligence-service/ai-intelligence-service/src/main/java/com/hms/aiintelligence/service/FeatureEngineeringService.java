package com.hms.aiintelligence.service;

import com.hms.aiintelligence.dto.CareGapDTO;
import com.hms.aiintelligence.dto.HealthTimelineDTO;
import com.hms.aiintelligence.dto.HealthTimelineEventDTO;
import com.hms.aiintelligence.dto.HealthTrendDTO;
import com.hms.aiintelligence.dto.PatientFeatureVectorDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
public class FeatureEngineeringService {

    private final HealthProfileAnalyzer analyzer;

    private final HealthTimelineService timelineService;

    private final TemporalHealthAnalyzer temporalAnalyzer;

    public FeatureEngineeringService(
            HealthProfileAnalyzer analyzer,
            HealthTimelineService timelineService,
            TemporalHealthAnalyzer temporalAnalyzer) {

        this.analyzer = analyzer;

        this.timelineService =
                timelineService;

        this.temporalAnalyzer =
                temporalAnalyzer;
    }

    public PatientFeatureVectorDTO buildFeatures(
            Long patientId) {

        throw new UnsupportedOperationException(
                "Use buildFeatures(PatientHealthContextDTO) "
                        + "to avoid rebuilding patient context."
        );
    }

    public PatientFeatureVectorDTO buildFeatures(
            PatientHealthContextDTO context) {

        if (context == null
                || context.getPatient() == null) {

            throw new IllegalArgumentException(
                    "Patient health context is required"
            );
        }

        Long patientId =
                context.getPatient().getId();

        log.info(
                "Building ML feature vector. patientId={}",
                patientId
        );

        HealthTimelineDTO timeline =
                timelineService.buildTimeline(
                        context
                );

        List<HealthTrendDTO> trends =
                analyzer.detectTrends(
                        context
                );

        List<CareGapDTO> careGaps =
                analyzer.detectCareGaps(
                        context
                );

        List<HealthTrendDTO> temporalTrends =
                temporalAnalyzer.analyze(
                        timeline
                );

        PatientFeatureVectorDTO features =
                new PatientFeatureVectorDTO();

        features.setPatientId(
                patientId
        );

        features.setAge(
                calculateAge(context)
        );

        features.setTotalAppointments(
                context.getTotalAppointments()
        );

        features.setCompletedAppointments(
                context.getCompletedAppointments()
        );

        features.setCancelledAppointments(
                context.getCancelledAppointments()
        );

        features.setTotalPrescriptions(
                context.getTotalPrescriptions()
        );

        features.setUniqueDiagnoses(
                countUniqueDiagnoses(
                        timeline
                )
        );

        features.setRecurringDiagnosisCount(
                countRecurringCategories(
                        trends,
                        "RECURRING_DIAGNOSIS"
                )
        );

        features.setRecurringSymptomCount(
                countRecurringCategories(
                        trends,
                        "RECURRING_SYMPTOMS"
                )
        );

        features.setRepeatedMedicationCount(
                countRecurringCategories(
                        trends,
                        "REPEATED_MEDICATION"
                )
        );

        features.setOverdueFollowUpCount(
                countCareGaps(
                        careGaps,
                        "FOLLOW_UP_OVERDUE"
                )
        );

        features.setCareGapCount(
                careGaps.size()
        );

        features.setRecentClinicalEvents(
                countRecentEvents(
                        timeline
                )
        );

        features.setRecentPrescriptions(
                countRecentEventsByType(
                        timeline,
                        "PRESCRIPTION"
                )
        );

        features.setRecentAppointments(
                countRecentEventsByType(
                        timeline,
                        "APPOINTMENT"
                )
        );

        features.setAppointmentCompletionRate(
                calculateRate(
                        context.getCompletedAppointments(),
                        context.getTotalAppointments()
                )
        );

        features.setAppointmentCancellationRate(
                calculateRate(
                        context.getCancelledAppointments(),
                        context.getTotalAppointments()
                )
        );

        features.setPrescriptionPerAppointmentRatio(
                calculateRatio(
                        context.getTotalPrescriptions(),
                        context.getTotalAppointments()
                )
        );

        features.setCareGapRate(
                calculateRatio(
                        careGaps.size(),
                        context.getTotalAppointments()
                )
        );

        /*
         * Temporal intelligence is intentionally included
         * in the feature-generation pipeline.
         *
         * The current DTO does not yet expose all temporal
         * signals. Those will be added when we define the
         * Java <-> Python ML contract.
         */
        log.debug(
                "Temporal features prepared. patientId={}, temporalPatterns={}",
                patientId,
                temporalTrends.size()
        );

        return features;
    }

    private int calculateAge(
            PatientHealthContextDTO context) {

        LocalDate dob =
                context.getPatient().getDob();

        if (dob == null) {
            return 0;
        }

        return Period.between(
                dob,
                LocalDate.now()
        ).getYears();
    }

    private int countUniqueDiagnoses(
            HealthTimelineDTO timeline) {

        if (timeline == null
                || timeline.getEvents() == null) {

            return 0;
        }

        Set<String> diagnoses =
                new HashSet<>();

        for (HealthTimelineEventDTO event :
                timeline.getEvents()) {

            if (event == null
                    || event.getDiagnoses() == null) {

                continue;
            }

            event.getDiagnoses()
                    .stream()
                    .filter(
                            diagnosis ->
                                    diagnosis != null
                                            && !diagnosis.isBlank()
                    )
                    .map(
                            diagnosis ->
                                    diagnosis
                                            .trim()
                                            .toLowerCase()
                    )
                    .forEach(
                            diagnoses::add
                    );
        }

        return diagnoses.size();
    }

    private int countRecurringCategories(
            List<HealthTrendDTO> trends,
            String category) {

        if (trends == null) {
            return 0;
        }

        return (int) trends.stream()
                .filter(
                        trend ->
                                trend != null
                                        && category.equals(
                                        trend.getCategory()
                                )
                )
                .count();
    }

    private int countCareGaps(
            List<CareGapDTO> gaps,
            String type) {

        if (gaps == null) {
            return 0;
        }

        return (int) gaps.stream()
                .filter(
                        gap ->
                                gap != null
                                        && type.equals(
                                        gap.getType()
                                )
                )
                .count();
    }

    private int countRecentEvents(
            HealthTimelineDTO timeline) {

        if (timeline == null
                || timeline.getEvents() == null) {

            return 0;
        }

        return (int) timeline.getEvents()
                .stream()
                .filter(this::isRecent)
                .count();
    }

    private int countRecentEventsByType(
            HealthTimelineDTO timeline,
            String type) {

        if (timeline == null
                || timeline.getEvents() == null) {

            return 0;
        }

        return (int) timeline.getEvents()
                .stream()
                .filter(
                        event ->
                                event != null
                                        && type.equals(
                                        event.getEventType()
                                )
                )
                .filter(this::isRecent)
                .count();
    }

    private boolean isRecent(
            HealthTimelineEventDTO event) {

        if (event == null
                || event.getTimestamp() == null) {

            return false;
        }

        return event.getTimestamp()
                .isAfter(
                        java.time.LocalDateTime.now()
                                .minusDays(90)
                );
    }

    private double calculateRate(
            int numerator,
            int denominator) {

        if (denominator <= 0) {
            return 0.0;
        }

        return Math.round(
                ((double) numerator / denominator)
                        * 10000
        ) / 10000.0;
    }

    private double calculateRatio(
            int numerator,
            int denominator) {

        return calculateRate(
                numerator,
                denominator
        );
    }
}