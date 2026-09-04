package com.hms.aiintelligence.service;

import com.hms.aiintelligence.client.AiMlClient;
import com.hms.aiintelligence.dto.AiMlPredictionRequestDTO;
import com.hms.aiintelligence.dto.AiMlPredictionResponseDTO;
import com.hms.aiintelligence.dto.PatientFeatureVectorDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;
import com.hms.aiintelligence.dto.PredictionDTO;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Slf4j
@Service
public class PredictionService {

    private final PatientContextService patientContextService;

    private final FeatureEngineeringService featureEngineeringService;

    private final AiMlFeatureMapper aiMlFeatureMapper;

    private final AiMlClient aiMlClient;

    public PredictionService(
            PatientContextService patientContextService,
            FeatureEngineeringService featureEngineeringService,
            AiMlFeatureMapper aiMlFeatureMapper,
            AiMlClient aiMlClient) {

        this.patientContextService =
                patientContextService;

        this.featureEngineeringService =
                featureEngineeringService;

        this.aiMlFeatureMapper =
                aiMlFeatureMapper;

        this.aiMlClient =
                aiMlClient;
    }

    public PredictionDTO generateBaselinePrediction(
            Long patientId) {

        log.info(
                "Generating ML prediction. patientId={}",
                patientId
        );

        PatientHealthContextDTO context =
                patientContextService
                        .buildPatientContext(patientId);

        PatientFeatureVectorDTO featureVector =
                featureEngineeringService
                        .buildFeatures(context);

        AiMlPredictionRequestDTO request =
                aiMlFeatureMapper
                        .toPredictionRequest(
                                patientId,
                                featureVector
                        );

        AiMlPredictionResponseDTO mlResponse;

        try {

            mlResponse =
                    aiMlClient.predict(request);

        } catch (Exception exception) {

            log.error(
                    "AI/ML prediction failed. patientId={}",
                    patientId,
                    exception
            );

            return buildFallbackPrediction(
                    patientId,
                    featureVector,
                    context
            );
        }

        return mapMlResponse(
                patientId,
                featureVector,
                context,
                mlResponse
        );
    }

    private PredictionDTO mapMlResponse(
            Long patientId,
            PatientFeatureVectorDTO featureVector,
            PatientHealthContextDTO context,
            AiMlPredictionResponseDTO mlResponse) {

        PredictionDTO prediction =
                new PredictionDTO();

        prediction.setPatientId(
                patientId
        );

        prediction.setPredictionType(
                "CARE_ATTENTION"
        );

        prediction.setPrediction(
                mlResponse.getPrediction()
        );

        prediction.setScore(
                mlResponse.getConfidence()
        );

        prediction.setConfidence(
                mlResponse.getConfidence()
        );

        prediction.setModelType(
                "MACHINE_LEARNING"
        );

        prediction.setModelVersion(
                mlResponse.getModel_version()
        );

        prediction.setFeatureVersion(
                "patient-health-v1"
        );

        prediction.setFallback(
                false
        );

        prediction.setDataWarnings(
                context.getDataWarnings() == null
                        ? new ArrayList<>()
                        : new ArrayList<>(
                                context.getDataWarnings()
                        )
        );

        prediction.setExplanation(
                mlResponse.getDisclaimer()
        );

        if (mlResponse.getContributing_factors() != null) {

            prediction.setContributingFactors(
                    mlResponse
                            .getContributing_factors()
                            .stream()
                            .map(
                                    factor ->
                                            factor.getName()
                            )
                            .toList()
            );

        } else {

            prediction.setContributingFactors(
                    new ArrayList<>()
            );
        }

        return prediction;
    }

    private PredictionDTO buildFallbackPrediction(
            Long patientId,
            PatientFeatureVectorDTO featureVector,
            PatientHealthContextDTO context) {

        PredictionDTO prediction =
                new PredictionDTO();

        prediction.setPatientId(
                patientId
        );

        prediction.setPredictionType(
                "CARE_ATTENTION"
        );

        prediction.setPrediction(
                "INSUFFICIENT_MODEL_DATA"
        );

        prediction.setScore(
                0.0
        );

        prediction.setConfidence(
                0.0
        );

        prediction.setModelType(
                "MACHINE_LEARNING"
        );

        prediction.setModelVersion(
                "unavailable"
        );

        prediction.setFeatureVersion(
                "patient-health-v1"
        );

        prediction.setFallback(
                true
        );

        prediction.setDataWarnings(
                context.getDataWarnings() == null
                        ? new ArrayList<>()
                        : new ArrayList<>(
                                context.getDataWarnings()
                        )
        );

        prediction.setContributingFactors(
                new ArrayList<>()
        );

        prediction.setExplanation(
                "AI/ML prediction service was unavailable. "
                        + "No clinical prediction was generated."
        );

        return prediction;
    }
}