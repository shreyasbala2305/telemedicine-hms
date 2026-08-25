package com.hms.aiintelligence.service;

import com.hms.aiintelligence.dto.AppointmentDTO;
import com.hms.aiintelligence.dto.CareGapDTO;
import com.hms.aiintelligence.dto.HealthInsightDTO;
import com.hms.aiintelligence.dto.HealthTrendDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;
import com.hms.aiintelligence.dto.PrescriptionDTO;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class HealthProfileAnalyzer {

    public List<HealthTrendDTO> detectTrends(
            PatientHealthContextDTO context) {

        List<HealthTrendDTO> trends =
                new ArrayList<>();

        detectRecurringDiagnoses(
                context,
                trends
        );

        detectRecurringSymptoms(
                context,
                trends
        );

        detectMedicationPatterns(
                context,
                trends
        );

        return trends;
    }

    public List<CareGapDTO> detectCareGaps(
            PatientHealthContextDTO context) {

        List<CareGapDTO> gaps =
                new ArrayList<>();

        detectMissedAppointments(
                context,
                gaps
        );

        detectFollowUpGaps(
                context,
                gaps
        );

        return gaps;
    }

    public List<HealthInsightDTO> generateInsights(
            PatientHealthContextDTO context,
            List<HealthTrendDTO> trends,
            List<CareGapDTO> careGaps) {

        List<HealthInsightDTO> insights =
                new ArrayList<>();

        for (HealthTrendDTO trend : trends) {

            HealthInsightDTO insight =
                    new HealthInsightDTO();

            insight.setType(
                    "TREND"
            );

            insight.setTitle(
                    trend.getCategory()
            );

            insight.setDescription(
                    trend.getDescription()
            );

            insight.setSeverity(
                    trend.getSeverity()
            );

            insight.setEvidence(
                    trend.getEvidence()
            );

            insight.setRecommendation(
                    "Discuss this recurring pattern with your healthcare provider."
            );

            insights.add(insight);
        }

        for (CareGapDTO gap : careGaps) {

            HealthInsightDTO insight =
                    new HealthInsightDTO();

            insight.setType(
                    "CARE_GAP"
            );

            insight.setTitle(
                    gap.getType()
            );

            insight.setDescription(
                    gap.getDescription()
            );

            insight.setSeverity(
                    gap.getSeverity()
            );

            insight.setEvidence(
                    List.of(gap.getDescription())
            );

            insight.setRecommendation(
                    gap.getRecommendedAction()
            );

            insights.add(insight);
        }

        return insights;
    }

    private void detectRecurringDiagnoses(
            PatientHealthContextDTO context,
            List<HealthTrendDTO> trends) {

        Map<String, Integer> counts =
                new HashMap<>();

        for (PrescriptionDTO prescription :
                safePrescriptions(context)) {

            String diagnosis =
                    normalize(prescription.getDiagnosis());

            if (!diagnosis.isBlank()) {

                counts.merge(
                        diagnosis,
                        1,
                        Integer::sum
                );
            }
        }

        counts.forEach((diagnosis, count) -> {

            if (count >= 2) {

                HealthTrendDTO trend =
                        new HealthTrendDTO();

                trend.setCategory(
                        "RECURRING_DIAGNOSIS"
                );

                trend.setDescription(
                        "The diagnosis '" +
                        diagnosis +
                        "' appears repeatedly in the prescription history."
                );

                trend.setSeverity(
                        count >= 3
                                ? "HIGH"
                                : "MEDIUM"
                );

                trend.setOccurrenceCount(
                        count
                );

                trend.setEvidence(
                        List.of(
                                "Diagnosis recorded " +
                                count +
                                " times."
                        )
                );

                trends.add(trend);
            }
        });
    }

    private void detectRecurringSymptoms(
            PatientHealthContextDTO context,
            List<HealthTrendDTO> trends) {

        Map<String, Integer> counts =
                new HashMap<>();

        for (PrescriptionDTO prescription :
                safePrescriptions(context)) {

            String symptoms =
                    normalize(
                            prescription.getSymptoms()
                    );

            if (!symptoms.isBlank()) {

                counts.merge(
                        symptoms,
                        1,
                        Integer::sum
                );
            }
        }

        counts.forEach((symptoms, count) -> {

            if (count >= 2) {

                HealthTrendDTO trend =
                        new HealthTrendDTO();

                trend.setCategory(
                        "RECURRING_SYMPTOMS"
                );

                trend.setDescription(
                        "Similar symptoms appear repeatedly in the recorded clinical history."
                );

                trend.setSeverity(
                        count >= 3
                                ? "HIGH"
                                : "MEDIUM"
                );

                trend.setOccurrenceCount(
                        count
                );

                trend.setEvidence(
                        List.of(
                                "Recorded symptom pattern: " +
                                symptoms,
                                "Occurrences: " +
                                count
                        )
                );

                trends.add(trend);
            }
        });
    }

    private void detectMedicationPatterns(
            PatientHealthContextDTO context,
            List<HealthTrendDTO> trends) {

        Map<String, Integer> medicineCounts =
                new HashMap<>();

        for (PrescriptionDTO prescription :
                safePrescriptions(context)) {

            if (prescription.getMedicines() == null) {
                continue;
            }

            prescription.getMedicines()
                    .forEach(medicine -> {

                        String name =
                                normalize(
                                        medicine.getName()
                                );

                        if (!name.isBlank()) {

                            medicineCounts.merge(
                                    name,
                                    1,
                                    Integer::sum
                            );
                        }
                    });
        }

        medicineCounts.forEach((medicine, count) -> {

            if (count >= 2) {

                HealthTrendDTO trend =
                        new HealthTrendDTO();

                trend.setCategory(
                        "REPEATED_MEDICATION"
                );

                trend.setDescription(
                        "The medication '" +
                        medicine +
                        "' appears repeatedly in prescription history."
                );

                trend.setSeverity(
                        "MEDIUM"
                );

                trend.setOccurrenceCount(
                        count
                );

                trend.setEvidence(
                        List.of(
                                "Medication recorded " +
                                count +
                                " times."
                        )
                );

                trends.add(trend);
            }
        });
    }

    private void detectMissedAppointments(
            PatientHealthContextDTO context,
            List<CareGapDTO> gaps) {

        long cancelled =
                context.getCancelledAppointments();

        if (cancelled >= 2) {

            CareGapDTO gap =
                    new CareGapDTO();

            gap.setType(
                    "MISSED_APPOINTMENTS"
            );

            gap.setDescription(
                    "The patient has multiple cancelled appointments in the recorded history."
            );

            gap.setSeverity(
                    cancelled >= 3
                            ? "HIGH"
                            : "MEDIUM"
            );

            gap.setRecommendedAction(
                    "Consider reviewing appointment continuity with the care team."
            );

            gaps.add(gap);
        }
    }

    private void detectFollowUpGaps(
            PatientHealthContextDTO context,
            List<CareGapDTO> gaps) {

        LocalDate today =
                LocalDate.now();

        for (PrescriptionDTO prescription :
                safePrescriptions(context)) {

            String followUpDate =
                    prescription.getFollowUpDate();

            if (followUpDate == null
                    || followUpDate.isBlank()) {
                continue;
            }

            try {

                LocalDate followUp =
                        LocalDate.parse(
                                followUpDate
                        );

                if (followUp.isBefore(today)) {

                    CareGapDTO gap =
                            new CareGapDTO();

                    gap.setType(
                            "FOLLOW_UP_OVERDUE"
                    );

                    gap.setDescription(
                            "A documented prescription follow-up date has passed."
                    );

                    gap.setSeverity(
                            "MEDIUM"
                    );

                    gap.setRecommendedAction(
                            "Review whether the recommended follow-up has been completed."
                    );

                    gaps.add(gap);
                }

            } catch (Exception ignored) {
                log.debug(
                        "Unable to parse follow-up date: {}",
                        followUpDate
                );
            }
        }
    }

    private List<PrescriptionDTO> safePrescriptions(
            PatientHealthContextDTO context) {

        if (context == null
                || context.getPrescriptions() == null) {

            return Collections.emptyList();
        }

        return context.getPrescriptions();
    }

    private String normalize(String value) {

        if (value == null) {
            return "";
        }

        return value.trim()
                .toLowerCase();
    }
}