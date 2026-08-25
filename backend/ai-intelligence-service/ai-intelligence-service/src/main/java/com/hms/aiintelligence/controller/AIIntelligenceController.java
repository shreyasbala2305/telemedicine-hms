package com.hms.aiintelligence.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.aiintelligence.dto.DoctorHealthBriefDTO;
import com.hms.aiintelligence.dto.HealthIntelligenceResponseDTO;
import com.hms.aiintelligence.dto.HealthScoreDTO;
import com.hms.aiintelligence.dto.HealthTimelineDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;
import com.hms.aiintelligence.dto.PredictionDTO;
import com.hms.aiintelligence.service.DoctorHealthBriefService;
import com.hms.aiintelligence.service.FeatureEngineeringService;
import com.hms.aiintelligence.service.HealthIntelligenceService;
import com.hms.aiintelligence.service.HealthScoreService;
import com.hms.aiintelligence.service.HealthTimelineService;
import com.hms.aiintelligence.service.PatientContextService;
import com.hms.aiintelligence.service.PredictionService;

@RestController
@RequestMapping("/ai")
public class AIIntelligenceController {

    private final PatientContextService patientContextService;
    
    private final HealthTimelineService healthTimelineService;
    
    private final HealthScoreService healthScoreService;

    private final HealthIntelligenceService healthIntelligenceService;
    
    private final DoctorHealthBriefService doctorHealthBriefService;
    
    private final PredictionService predictionService;
    
    private final FeatureEngineeringService featureEngineeringService;

    public AIIntelligenceController(
            PatientContextService patientContextService,
            HealthIntelligenceService healthIntelligenceService,
            DoctorHealthBriefService doctorHealthBriefService,
            HealthTimelineService healthTimelineService,
            HealthScoreService healthScoreService,
            FeatureEngineeringService featureEngineeringService,
            PredictionService predictionService) {
        this.patientContextService = patientContextService;
        this.healthIntelligenceService = healthIntelligenceService;
        this.doctorHealthBriefService = doctorHealthBriefService;
        this.healthTimelineService = healthTimelineService;
        this.healthScoreService = healthScoreService;
        this.predictionService = predictionService;
        this.featureEngineeringService = featureEngineeringService;
    }

    @GetMapping("/patients/{patientId}/context")
    @PreAuthorize(
            "hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')"
    )
    public ResponseEntity<PatientHealthContextDTO>
    getPatientContext(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                patientContextService
                        .buildPatientContext(patientId)
        );
    }

    @GetMapping("/patients/{patientId}/health")
    @PreAuthorize(
            "hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')"
    )
    public ResponseEntity<HealthIntelligenceResponseDTO>
    getHealthIntelligence(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                healthIntelligenceService
                        .analyzePatient(patientId)
        );
    }
    
    @GetMapping("/patients/{patientId}/doctor-brief")
    @PreAuthorize(
            "hasAnyRole('DOCTOR', 'ADMIN')"
    )
    public ResponseEntity<DoctorHealthBriefDTO>
    getDoctorHealthBrief(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                doctorHealthBriefService
                        .generateBrief(patientId)
        );
    }
    
    @GetMapping("/patients/{patientId}/timeline")
    @PreAuthorize(
            "hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')"
    )
    public ResponseEntity<HealthTimelineDTO>
    getPatientTimeline(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                healthTimelineService
                        .buildTimeline(patientId)
        );
    }
    
    @GetMapping("/patients/{patientId}/health-score")
    @PreAuthorize(
            "hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')"
    )
    public ResponseEntity<HealthScoreDTO>
    getHealthScore(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                healthScoreService
                        .calculateScore(patientId)
        );
    }
    
    @GetMapping("/patients/{patientId}/prediction")
    @PreAuthorize(
            "hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')"
    )
    public ResponseEntity<PredictionDTO>
    getPrediction(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                predictionService
                        .generateBaselinePrediction(
                                patientId
                        )
        );
    }
}