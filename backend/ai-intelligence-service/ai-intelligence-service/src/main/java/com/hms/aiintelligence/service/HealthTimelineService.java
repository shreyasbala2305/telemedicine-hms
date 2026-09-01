package com.hms.aiintelligence.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.hms.aiintelligence.dto.AppointmentDTO;
import com.hms.aiintelligence.dto.HealthTimelineDTO;
import com.hms.aiintelligence.dto.HealthTimelineEventDTO;
import com.hms.aiintelligence.dto.MedicineDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;
import com.hms.aiintelligence.dto.PrescriptionDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class HealthTimelineService {

    private final PatientContextService patientContextService;

    public HealthTimelineService(
            PatientContextService patientContextService) {

        this.patientContextService =
                patientContextService;
    }

    public HealthTimelineDTO buildTimeline(
            Long patientId) {

        PatientHealthContextDTO context =
                patientContextService
                        .buildPatientContext(patientId);

        return buildTimeline(context);
    }

    public HealthTimelineDTO buildTimeline(
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
                "Building health timeline. patientId={}",
                patientId
        );

        List<HealthTimelineEventDTO> events =
                new ArrayList<>();

        addAppointmentEvents(
                context,
                events
        );

        addPrescriptionEvents(
                context,
                events
        );

        events.sort(
                Comparator.comparing(
                        HealthTimelineEventDTO::getTimestamp,
                        Comparator.nullsLast(
                                Comparator.naturalOrder()
                        )
                )
        );

        HealthTimelineDTO timeline =
                new HealthTimelineDTO();

        timeline.setPatientId(patientId);

        timeline.setPatientName(
                context.getPatient().getName()
        );

        timeline.setEvents(events);

        timeline.setTotalEvents(
                events.size()
        );

        if (!events.isEmpty()) {

            HealthTimelineEventDTO first =
                    events.get(0);

            HealthTimelineEventDTO last =
                    events.get(events.size() - 1);

            if (isValidTimestamp(first.getTimestamp())) {

                timeline.setEarliestEvent(
                        first.getTimestamp().toString()
                );
            }

            if (isValidTimestamp(last.getTimestamp())) {

                timeline.setLatestEvent(
                        last.getTimestamp().toString()
                );
            }
        }

        return timeline;
    }

    private void addAppointmentEvents(
            PatientHealthContextDTO context,
            List<HealthTimelineEventDTO> events) {

        if (context.getAppointments() == null) {
            return;
        }

        for (AppointmentDTO appointment :
                context.getAppointments()) {

            if (appointment == null) {
                continue;
            }

            HealthTimelineEventDTO event =
                    new HealthTimelineEventDTO();

            event.setTimestamp(
                    appointment.getDateTime()
            );

            event.setEventType(
                    "APPOINTMENT"
            );

            event.setTitle(
                    "Medical Appointment"
            );

            event.setDescription(
                    buildAppointmentDescription(
                            appointment
                    )
            );

            event.setSymptoms(
                    List.of()
            );

            event.setDiagnoses(
                    List.of()
            );

            event.setMedications(
                    List.of()
            );

            event.setAppointmentId(
                    appointment.getId()
            );

            events.add(event);
        }
    }

    private void addPrescriptionEvents(
            PatientHealthContextDTO context,
            List<HealthTimelineEventDTO> events) {

        if (context.getPrescriptions() == null) {
            return;
        }

        for (PrescriptionDTO prescription :
                context.getPrescriptions()) {

            if (prescription == null) {
                continue;
            }

            HealthTimelineEventDTO event =
                    new HealthTimelineEventDTO();

            /*
             * PrescriptionDTO currently does not expose
             * createdAt/issuedAt.
             *
             * Therefore we use the appointment timestamp
             * associated with the prescription instead of
             * incorrectly treating followUpDate as the
             * clinical event timestamp.
             */
            event.setTimestamp(
                    resolvePrescriptionTimestamp(
                            prescription,
                            context
                    )
            );

            event.setEventType(
                    "PRESCRIPTION"
            );

            event.setTitle(
                    "Prescription"
            );

            event.setDescription(
                    buildPrescriptionDescription(
                            prescription
                    )
            );

            event.setSymptoms(
                    toList(
                            prescription.getSymptoms()
                    )
            );

            event.setDiagnoses(
                    toList(
                            prescription.getDiagnosis()
                    )
            );

            event.setMedications(
                    extractMedicationNames(
                            prescription
                    )
            );

            event.setPrescriptionId(
                    prescription.getId()
            );

            event.setAppointmentId(
                    prescription.getAppointmentId()
            );

            events.add(event);
        }
    }

    private LocalDateTime resolvePrescriptionTimestamp(
            PrescriptionDTO prescription,
            PatientHealthContextDTO context) {

        if (prescription.getAppointmentId() == null
                || context.getAppointments() == null) {

            return null;
        }

        return context.getAppointments()
                .stream()
                .filter(Objects::nonNull)
                .filter(
                        appointment ->
                                prescription
                                        .getAppointmentId()
                                        .equals(
                                                appointment.getId()
                                        )
                )
                .map(AppointmentDTO::getDateTime)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    private boolean isValidTimestamp(
            LocalDateTime timestamp) {

        return timestamp != null
                && !timestamp.equals(
                        LocalDateTime.MIN
                );
    }

    private String buildAppointmentDescription(
            AppointmentDTO appointment) {

        String status =
                appointment.getStatus();

        if (status == null
                || status.isBlank()) {

            status = "UNKNOWN";
        }

        return "Appointment status: " + status;
    }

    private String buildPrescriptionDescription(
            PrescriptionDTO prescription) {

        StringBuilder description =
                new StringBuilder();

        if (prescription.getDiagnosis() != null
                && !prescription.getDiagnosis().isBlank()) {

            description.append(
                    "Diagnosis: "
            );

            description.append(
                    prescription.getDiagnosis()
            );
        }

        if (prescription.getSymptoms() != null
                && !prescription.getSymptoms().isBlank()) {

            if (!description.isEmpty()) {
                description.append(". ");
            }

            description.append(
                    "Symptoms: "
            );

            description.append(
                    prescription.getSymptoms()
            );
        }

        return description.toString();
    }

    private List<String> extractMedicationNames(
            PrescriptionDTO prescription) {

        if (prescription.getMedicines() == null) {
            return List.of();
        }

        return prescription.getMedicines()
                .stream()
                .filter(Objects::nonNull)
                .map(MedicineDTO::getName)
                .filter(
                        name ->
                                name != null
                                        && !name.isBlank()
                )
                .map(String::trim)
                .distinct()
                .toList();
    }

    private List<String> toList(
            String value) {

        if (value == null
                || value.isBlank()) {

            return List.of();
        }

        return List.of(value.trim());
    }
}