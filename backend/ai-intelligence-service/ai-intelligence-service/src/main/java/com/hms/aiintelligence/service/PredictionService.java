package com.hms.aiintelligence.service;

import com.hms.aiintelligence.dto.CareGapDTO;
import com.hms.aiintelligence.dto.PatientFeatureVectorDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;
import com.hms.aiintelligence.dto.PredictionDTO;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class PredictionService {

    private final PatientContextService patientContextService;
    private final FeatureEngineeringService featureEngineeringService;

    public PredictionService(
            PatientContextService patientContextService,
            FeatureEngineeringService featureEngineeringService) {

        this.patientContextService =
                patientContextService;

        this.featureEngineeringService =
                featureEngineeringService;
    }

    public PredictionDTO generateBaselinePrediction(
            Long patientId) {

        PatientHealthContextDTO context =
                patientContextService
                        .buildPatientContext(patientId);

        PatientFeatureVectorDTO features =
                featureEngineeringService
                        .buildFeatures(context);

        List<String> factors =
                new ArrayList<>();

        double attentionScore = 0.0;

        if (features.getCareGapCount() > 0) {

            attentionScore += 0.20;

            factors.add(
                    "Care gaps detected"
            );
        }

        if (features.getRecurringDiagnosisCount() > 0) {

            attentionScore += 0.20;

            factors.add(
                    "Recurring diagnoses detected"
            );
        }

        if (features.getRecurringSymptomCount() > 0) {

            attentionScore += 0.15;

            factors.add(
                    "Recurring symptoms detected"
            );
        }

        if (features.getAppointmentCancellationRate()
                >= 0.30) {

            attentionScore += 0.15;

            factors.add(
                    "High appointment cancellation rate"
            );
        }

        if (features.getRecentClinicalEvents()
                >= 5) {

            attentionScore += 0.10;

            factors.add(
                    "High recent clinical activity"
            );
        }

        if (features.getOverdueFollowUpCount() > 0) {

            attentionScore += 0.15;

            factors.add(
                    "Overdue follow-up detected"
            );
        }

        attentionScore =
                Math.min(
                        1.0,
                        attentionScore
                );

        PredictionDTO prediction =
                new PredictionDTO();

        prediction.setPatientId(
                patientId
        );

        prediction.setPredictionType(
                "CARE_ATTENTION"
        );

        prediction.setPrediction(
                determinePrediction(
                        attentionScore
                )
        );

        prediction.setScore(
                attentionScore
        );

        prediction.setConfidence(
                calculateConfidence(
                        factors.size(),
                        context
                )
        );

        prediction.setModelType(
                "RULE_BASED"
        );

        prediction.setModelVersion(
                "baseline-v1"
        );

        prediction.setFeatureVersion(
                features.getFeatureVersion()
        );

        prediction.setContributingFactors(
                factors
        );

        prediction.setFallback(
                false
        );

        prediction.setDataWarnings(
                new ArrayList<>(
                        context.getDataWarnings()
                )
        );

        prediction.setExplanation(
                "Baseline care-attention prediction derived from explainable clinical-history features. This is not a medical diagnosis."
        );

        return prediction;
    }

    private String determinePrediction(
            double score) {

        if (score >= 0.70) {
            return "HIGH_ATTENTION";
        }

        if (score >= 0.40) {
            return "MODERATE_ATTENTION";
        }

        return "LOW_ATTENTION";
    }

    private double calculateConfidence(
            int factorCount,
            PatientHealthContextDTO context) {

        double confidence =
                factorCount == 0
                        ? 0.50
                        : 0.55 + (factorCount * 0.08);

        if (!context.isAppointmentDataAvailable()) {
            confidence -= 0.10;
        }

        if (!context.isPrescriptionDataAvailable()) {
            confidence -= 0.10;
        }

        return Math.max(
                0.0,
                Math.min(
                        0.95,
                        confidence
                )
        );
    }
}