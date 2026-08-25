package com.hms.aiintelligence.service;

import com.hms.aiintelligence.dto.CareGapDTO;
import com.hms.aiintelligence.dto.HealthScoreDTO;
import com.hms.aiintelligence.dto.HealthScoreFactorDTO;
import com.hms.aiintelligence.dto.HealthTimelineDTO;
import com.hms.aiintelligence.dto.HealthTrendDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class HealthScoreService {

    private final HealthProfileAnalyzer analyzer;
    private final HealthTimelineService timelineService;
    private final TemporalHealthAnalyzer temporalAnalyzer;

    public HealthScoreService(
            HealthProfileAnalyzer analyzer,
            HealthTimelineService timelineService,
            TemporalHealthAnalyzer temporalAnalyzer) {

        this.analyzer = analyzer;
        this.timelineService = timelineService;
        this.temporalAnalyzer = temporalAnalyzer;
    }

    public HealthScoreDTO calculateScore(
            Long patientId) {

        throw new UnsupportedOperationException(
                "Use calculateScore(PatientHealthContextDTO) "
                        + "to avoid rebuilding patient context."
        );
    }

    public HealthScoreDTO calculateScore(
            PatientHealthContextDTO context) {

        Long patientId =
                context.getPatient().getId();

        HealthTimelineDTO timeline =
                timelineService.buildTimeline(
                        context
                );

        List<HealthTrendDTO> trends =
                analyzer.detectTrends(context);

        List<CareGapDTO> careGaps =
                analyzer.detectCareGaps(context);

        List<HealthTrendDTO> temporalTrends =
                temporalAnalyzer.analyze(
                        timeline
                );

        List<HealthScoreFactorDTO> factors =
                new ArrayList<>();

        int score = 100;

        long cancelled =
                context.getCancelledAppointments();

        if (cancelled > 0) {

            int impact =
                    Math.min(
                            20,
                            (int) cancelled * 5
                    );

            score -= impact;

            factors.add(
                    createFactor(
                            "APPOINTMENT_CONTINUITY",
                            impact,
                            "NEGATIVE",
                            "Repeated cancelled appointments reduce the care-continuity score.",
                            "Cancelled appointments: " + cancelled
                    )
            );
        }

        if (!careGaps.isEmpty()) {

            int impact =
                    Math.min(
                            25,
                            careGaps.size() * 8
                    );

            score -= impact;

            factors.add(
                    createFactor(
                            "CARE_GAPS",
                            impact,
                            "NEGATIVE",
                            "Outstanding care gaps require attention.",
                            "Detected care gaps: " +
                                    careGaps.size()
                    )
            );
        }

        if (!temporalTrends.isEmpty()) {

            int impact =
                    Math.min(
                            25,
                            temporalTrends.size() * 7
                    );

            score -= impact;

            factors.add(
                    createFactor(
                            "RECURRING_PATTERNS",
                            impact,
                            "NEGATIVE",
                            "Repeated clinical patterns were detected in the available history.",
                            "Recurring patterns: " +
                                    temporalTrends.size()
                    )
            );
        }

        if (context.getTotalAppointments() > 0
                && context.getTotalPrescriptions() > 0) {

            int impact = 5;

            score += impact;

            factors.add(
                    createFactor(
                            "RECORDED_CARE_ENGAGEMENT",
                            impact,
                            "POSITIVE",
                            "The available records contain both clinical encounters and prescriptions.",
                            "Appointments: " +
                                    context.getTotalAppointments()
                                    + ", prescriptions: "
                                    + context.getTotalPrescriptions()
                    )
            );
        }

        score =
                Math.max(
                        0,
                        Math.min(
                                100,
                                score
                        )
                );

        HealthScoreDTO result =
                new HealthScoreDTO();

        result.setPatientId(patientId);

        result.setScore(score);

        result.setCategory(
                determineCategory(score)
        );

        result.setExplanation(
                buildExplanation(
                        score,
                        factors,
                        context
                )
        );

        result.setFactors(factors);

        return result;
    }

    private HealthScoreFactorDTO createFactor(
            String factor,
            int impact,
            String direction,
            String explanation,
            String evidence) {

        HealthScoreFactorDTO dto =
                new HealthScoreFactorDTO();

        dto.setFactor(factor);
        dto.setImpact(impact);
        dto.setDirection(direction);
        dto.setExplanation(explanation);
        dto.setEvidence(evidence);

        return dto;
    }

    private String determineCategory(
            int score) {

        if (score >= 80) {
            return "STABLE";
        }

        if (score >= 60) {
            return "WATCH";
        }

        if (score >= 40) {
            return "ATTENTION";
        }

        return "HIGH_ATTENTION";
    }

    private String buildExplanation(
            int score,
            List<HealthScoreFactorDTO> factors,
            PatientHealthContextDTO context) {

        if (factors.isEmpty()) {

            return "No significant negative factors were identified from the available records.";
        }

        if (!context.getDataWarnings().isEmpty()) {

            return "Care Intelligence Score is based on appointment continuity, care gaps, recurring patterns, and recorded care engagement. Some source data was unavailable during analysis.";
        }

        return "Care Intelligence Score is based on appointment continuity, care gaps, recurring patterns, and recorded care engagement. It is not a medical diagnosis or clinical risk score.";
    }
}