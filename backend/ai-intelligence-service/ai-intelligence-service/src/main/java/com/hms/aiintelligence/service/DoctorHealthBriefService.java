package com.hms.aiintelligence.service;

import com.hms.aiintelligence.dto.DoctorHealthBriefDTO;
import com.hms.aiintelligence.dto.HealthInsightDTO;
import com.hms.aiintelligence.dto.HealthTrendDTO;
import com.hms.aiintelligence.dto.CareGapDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;
import com.hms.aiintelligence.dto.PrescriptionDTO;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
public class DoctorHealthBriefService {

    private final PatientContextService patientContextService;
    private final HealthProfileAnalyzer analyzer;

    public DoctorHealthBriefService(
            PatientContextService patientContextService,
            HealthProfileAnalyzer analyzer) {

        this.patientContextService =
                patientContextService;

        this.analyzer =
                analyzer;
    }

    public DoctorHealthBriefDTO generateBrief(
            Long patientId) {

        log.info(
                "Generating doctor health brief. patientId={}",
                patientId
        );

        PatientHealthContextDTO context =
                patientContextService
                        .buildPatientContext(patientId);

        List<HealthTrendDTO> trends =
                analyzer.detectTrends(context);

        List<CareGapDTO> careGaps =
                analyzer.detectCareGaps(context);

        List<HealthInsightDTO> insights =
                analyzer.generateInsights(
                        context,
                        trends,
                        careGaps
                );

        DoctorHealthBriefDTO brief =
                new DoctorHealthBriefDTO();

        brief.setPatientId(
                patientId
        );

        brief.setPatientName(
                context.getPatient().getName()
        );

        brief.setSummary(
                buildSummary(
                        context,
                        trends,
                        careGaps
                )
        );

        brief.setImportantTrends(
                trends
        );

        brief.setCareGaps(
                careGaps
        );

        brief.setAttentionPoints(
                insights
        );

        brief.setRecentDiagnoses(
                extractDiagnoses(context)
        );

        brief.setCurrentMedications(
                extractMedications(context)
        );

        brief.setRecentSymptoms(
                extractSymptoms(context)
        );

        return brief;
    }

    private String buildSummary(
            PatientHealthContextDTO context,
            List<HealthTrendDTO> trends,
            List<CareGapDTO> careGaps) {

        StringBuilder summary =
                new StringBuilder();

        summary.append(
                "Patient has "
        );

        summary.append(
                context.getTotalAppointments()
        );

        summary.append(
                " recorded appointment(s) and "
        );

        summary.append(
                context.getTotalPrescriptions()
        );

        summary.append(
                " prescription(s). "
        );

        if (!trends.isEmpty()) {

            summary.append(
                    trends.size()
            );

            summary.append(
                    " recurring health pattern(s) were identified. "
            );
        }

        if (!careGaps.isEmpty()) {

            summary.append(
                    careGaps.size()
            );

            summary.append(
                    " care gap(s) may require attention."
            );
        }

        if (trends.isEmpty()
                && careGaps.isEmpty()) {

            summary.append(
                    "No significant recurring pattern or care gap was identified from the available records."
            );
        }

        return summary.toString();
    }

    private List<String> extractDiagnoses(
            PatientHealthContextDTO context) {

        Set<String> diagnoses =
                new LinkedHashSet<>();

        for (PrescriptionDTO prescription :
                safePrescriptions(context)) {

            if (prescription.getDiagnosis() != null
                    && !prescription.getDiagnosis().isBlank()) {

                diagnoses.add(
                        prescription.getDiagnosis()
                );
            }
        }

        return new ArrayList<>(
                diagnoses
        );
    }

    private List<String> extractSymptoms(
            PatientHealthContextDTO context) {

        Set<String> symptoms =
                new LinkedHashSet<>();

        for (PrescriptionDTO prescription :
                safePrescriptions(context)) {

            if (prescription.getSymptoms() != null
                    && !prescription.getSymptoms().isBlank()) {

                symptoms.add(
                        prescription.getSymptoms()
                );
            }
        }

        return new ArrayList<>(
                symptoms
        );
    }

    private List<String> extractMedications(
            PatientHealthContextDTO context) {

        Set<String> medications =
                new LinkedHashSet<>();

        for (PrescriptionDTO prescription :
                safePrescriptions(context)) {

            if (prescription.getMedicines() == null) {
                continue;
            }

            prescription.getMedicines()
                    .forEach(medicine -> {

                        if (medicine.getName() != null
                                && !medicine.getName().isBlank()) {

                            medications.add(
                                    medicine.getName()
                            );
                        }
                    });
        }

        return new ArrayList<>(
                medications
        );
    }

    private List<PrescriptionDTO> safePrescriptions(
            PatientHealthContextDTO context) {

        if (context == null
                || context.getPrescriptions() == null) {

            return List.of();
        }

        return context.getPrescriptions();
    }
}