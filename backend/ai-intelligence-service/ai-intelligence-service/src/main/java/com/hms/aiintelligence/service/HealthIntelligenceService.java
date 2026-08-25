package com.hms.aiintelligence.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hms.aiintelligence.dto.CareGapDTO;
import com.hms.aiintelligence.dto.HealthInsightDTO;
import com.hms.aiintelligence.dto.HealthIntelligenceResponseDTO;
import com.hms.aiintelligence.dto.HealthScoreDTO;
import com.hms.aiintelligence.dto.HealthTimelineDTO;
import com.hms.aiintelligence.dto.HealthTrendDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class HealthIntelligenceService {

    private final PatientContextService patientContextService;
    private final HealthProfileAnalyzer analyzer;
    private final HealthTimelineService healthTimelineService;
    private final TemporalHealthAnalyzer temporalHealthAnalyzer;
    private final HealthScoreService healthScoreService;

    public HealthIntelligenceService(
            PatientContextService patientContextService,
            HealthProfileAnalyzer analyzer,
            HealthTimelineService healthTimelineService,
            TemporalHealthAnalyzer temporalHealthAnalyzer,
            HealthScoreService healthScoreService) {

        this.patientContextService =
                patientContextService;

        this.analyzer = analyzer;

        this.healthTimelineService =
                healthTimelineService;

        this.temporalHealthAnalyzer =
                temporalHealthAnalyzer;

        this.healthScoreService =
                healthScoreService;
    }

    public HealthIntelligenceResponseDTO analyzePatient(
            Long patientId) {

        log.info(
                "Generating health intelligence. patientId={}",
                patientId
        );

        PatientHealthContextDTO context =
                patientContextService
                        .buildPatientContext(patientId);

        List<HealthTrendDTO> trends =
                new ArrayList<>(
                        analyzer.detectTrends(context)
                );

        List<CareGapDTO> careGaps =
                analyzer.detectCareGaps(context);

        HealthTimelineDTO timeline =
                healthTimelineService
                        .buildTimeline(context);

        List<HealthTrendDTO> temporalTrends =
                temporalHealthAnalyzer
                        .analyze(timeline);

        trends.addAll(
                temporalTrends
        );
        
        List<HealthInsightDTO> insights =
                analyzer.generateInsights(
                        context,
                        trends,
                        careGaps
                );

        HealthScoreDTO healthScore =
                healthScoreService
                        .calculateScore(context);

        HealthIntelligenceResponseDTO response =
                new HealthIntelligenceResponseDTO();

        response.setPatientId(
                patientId
        );

        response.setPatientName(
                context.getPatient().getName()
        );

        response.setGeneratedAt(
                LocalDateTime.now().toString()
        );

        response.setContext(
                context
        );

        response.setTrends(
                trends
        );

        response.setCareGaps(
                careGaps
        );

        response.setInsights(
                insights
        );

        response.setHealthScore(
                healthScore
        );

        log.info(
                "Health intelligence generated. patientId={}, trends={}, careGaps={}, insights={}, warnings={}",
                patientId,
                trends.size(),
                careGaps.size(),
                insights.size(),
                context.getDataWarnings().size()
        );

        return response;
    }
}