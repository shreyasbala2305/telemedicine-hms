package com.hms.aiintelligence.service;

import com.hms.aiintelligence.dto.CareGapDTO;
import com.hms.aiintelligence.dto.HealthTimelineDTO;
import com.hms.aiintelligence.dto.HealthTimelineEventDTO;
import com.hms.aiintelligence.dto.HealthTrendDTO;
import com.hms.aiintelligence.dto.PatientFeatureVectorDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

        /*
         * Patient demographics.
         */
        features.setAge(
                calculateAge(context)
        );

        /*
         * Appointment history.
         */
        features.setTotalAppointments(
                context.getTotalAppointments()
        );

        features.setCompletedAppointments(
                context.getCompletedAppointments()
        );

        features.setCancelledAppointments(
                context.getCancelledAppointments()
        );

        /*
         * Prescription history.
         */
        features.setTotalPrescriptions(
                context.getTotalPrescriptions()
        );

        /*
         * Diagnosis features.
         */
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

        /*
         * Symptom features.
         */
        features.setSymptomCount(
                countUniqueSymptoms(
                        timeline
                )
        );

        features.setRecurringSymptomCount(
                countRecurringCategories(
                        trends,
                        "RECURRING_SYMPTOMS"
                )
        );

        /*
         * Medication features.
         */
        features.setMedicationCount(
                countUniqueMedications(
                        timeline
                )
        );

        features.setRepeatedMedicationCount(
                countRecurringCategories(
                        trends,
                        "REPEATED_MEDICATION"
                )
        );

        /*
         * Active medications and specialist visits cannot
         * currently be derived reliably from the available
         * PatientHealthContextDTO / HealthTimelineEventDTO
         * contract.
         *
         * Keep these explicitly neutral until their actual
         * domain semantics are exposed.
         */
        features.setActiveMedicationCount(
                0
        );

        features.setSpecialistVisitCount(
                0
        );

        /*
         * Chronic conditions also require an explicit
         * chronic-condition classification from the domain
         * model. Do not infer chronicity merely from the
         * number of diagnoses.
         */
        features.setChronicConditionCount(
                0
        );

        /*
         * Care-gap features.
         */
        features.setOverdueFollowUpCount(
                countCareGaps(
                        careGaps,
                        "FOLLOW_UP_OVERDUE"
                )
        );

        features.setCareGapCount(
                careGaps.size()
        );

        /*
         * Recent clinical activity.
         */
        features.setRecentClinicalEvents(
                countRecentEvents(
                        timeline
                )
        );

        /*
         * Keep the existing 90-day recent fields for the
         * broader Java feature vector.
         */
        features.setRecentPrescriptions(
                countEventsByTypeWithinDays(
                        timeline,
                        "PRESCRIPTION",
                        90
                )
        );

        features.setRecentAppointments(
                countEventsByTypeWithinDays(
                        timeline,
                        "APPOINTMENT",
                        90
                )
        );

        /*
         * Exact temporal features used by patient-health-v1.
         */
        features.setAppointmentsLast30Days(
                countEventsByTypeWithinDays(
                        timeline,
                        "APPOINTMENT",
                        30
                )
        );

        features.setAppointmentsLast90Days(
                countEventsByTypeWithinDays(
                        timeline,
                        "APPOINTMENT",
                        90
                )
        );

        features.setPrescriptionsLast90Days(
                countEventsByTypeWithinDays(
                        timeline,
                        "PRESCRIPTION",
                        90
                )
        );

        features.setDaysSinceLastAppointment(
                calculateDaysSinceLastAppointment(
                        timeline
                )
        );

        /*
         * Derived appointment metrics.
         */
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

        log.debug(
                "Temporal features prepared. patientId={}, "
                        + "temporalPatterns={}, appointments30d={}, "
                        + "appointments90d={}, prescriptions90d={}, "
                        + "daysSinceLastAppointment={}",
                patientId,
                temporalTrends.size(),
                features.getAppointmentsLast30Days(),
                features.getAppointmentsLast90Days(),
                features.getPrescriptionsLast90Days(),
                features.getDaysSinceLastAppointment()
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

    private int countUniqueSymptoms(
            HealthTimelineDTO timeline) {

        if (timeline == null
                || timeline.getEvents() == null) {

            return 0;
        }

        Set<String> symptoms =
                new HashSet<>();

        for (HealthTimelineEventDTO event :
                timeline.getEvents()) {

            if (event == null
                    || event.getSymptoms() == null) {

                continue;
            }

            event.getSymptoms()
                    .stream()
                    .filter(
                            symptom ->
                                    symptom != null
                                            && !symptom.isBlank()
                    )
                    .map(
                            symptom ->
                                    symptom
                                            .trim()
                                            .toLowerCase()
                    )
                    .forEach(
                            symptoms::add
                    );
        }

        return symptoms.size();
    }

    private int countUniqueMedications(
            HealthTimelineDTO timeline) {

        if (timeline == null
                || timeline.getEvents() == null) {

            return 0;
        }

        Set<String> medications =
                new HashSet<>();

        for (HealthTimelineEventDTO event :
                timeline.getEvents()) {

            if (event == null
                    || event.getMedications() == null) {

                continue;
            }

            event.getMedications()
                    .stream()
                    .filter(
                            medication ->
                                    medication != null
                                            && !medication.isBlank()
                    )
                    .map(
                            medication ->
                                    medication
                                            .trim()
                                            .toLowerCase()
                    )
                    .forEach(
                            medications::add
                    );
        }

        return medications.size();
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

        return countEventsWithinDays(
                timeline,
                90
        );
    }

    private int countEventsByTypeWithinDays(
            HealthTimelineDTO timeline,
            String type,
            int days) {

        if (timeline == null
                || timeline.getEvents() == null) {

            return 0;
        }

        LocalDateTime cutoff =
                LocalDateTime.now()
                        .minusDays(days);

        return (int) timeline.getEvents()
                .stream()
                .filter(
                        event ->
                                event != null
                                        && type.equals(
                                        event.getEventType()
                                )
                )
                .filter(
                        event ->
                                event.getTimestamp() != null
                                        && event.getTimestamp()
                                        .isAfter(cutoff)
                )
                .count();
    }

    private int countEventsWithinDays(
            HealthTimelineDTO timeline,
            int days) {

        if (timeline == null
                || timeline.getEvents() == null) {

            return 0;
        }

        LocalDateTime cutoff =
                LocalDateTime.now()
                        .minusDays(days);

        return (int) timeline.getEvents()
                .stream()
                .filter(
                        event ->
                                event != null
                                        && event.getTimestamp() != null
                                        && event.getTimestamp()
                                        .isAfter(cutoff)
                )
                .count();
    }

    private Integer calculateDaysSinceLastAppointment(
            HealthTimelineDTO timeline) {

        if (timeline == null
                || timeline.getEvents() == null) {

            return null;
        }

        return timeline.getEvents()
                .stream()
                .filter(
                        event ->
                                event != null
                                        && "APPOINTMENT".equals(
                                        event.getEventType()
                                )
                                        && event.getTimestamp() != null
                )
                .map(
                        HealthTimelineEventDTO::getTimestamp
                )
                .max(
                        LocalDateTime::compareTo
                )
                .map(
                        timestamp ->
                                (int) Duration
                                        .between(
                                                timestamp,
                                                LocalDateTime.now()
                                        )
                                        .toDays()
                )
                .orElse(null);
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