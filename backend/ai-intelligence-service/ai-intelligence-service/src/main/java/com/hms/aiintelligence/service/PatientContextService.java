package com.hms.aiintelligence.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.hms.aiintelligence.client.AppointmentClient;
import com.hms.aiintelligence.client.DoctorClient;
import com.hms.aiintelligence.client.PatientClient;
import com.hms.aiintelligence.client.PrescriptionClient;
import com.hms.aiintelligence.dto.AppointmentDTO;
import com.hms.aiintelligence.dto.AppointmentPageDTO;
import com.hms.aiintelligence.dto.DoctorDTO;
import com.hms.aiintelligence.dto.PatientDTO;
import com.hms.aiintelligence.dto.PatientHealthContextDTO;
import com.hms.aiintelligence.dto.PrescriptionDTO;
import com.hms.aiintelligence.security.SecurityUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PatientContextService {

    private final PatientClient patientClient;
    private final AppointmentClient appointmentClient;
    private final PrescriptionClient prescriptionClient;
    private final DoctorClient doctorClient;

    public PatientContextService(
            PatientClient patientClient,
            AppointmentClient appointmentClient,
            PrescriptionClient prescriptionClient,
            DoctorClient doctorClient) {

        this.patientClient = patientClient;
        this.appointmentClient = appointmentClient;
        this.prescriptionClient = prescriptionClient;
        this.doctorClient = doctorClient;
    }

    public PatientHealthContextDTO buildPatientContext(
            Long patientId) {

        if (patientId == null || patientId <= 0) {
            throw new IllegalArgumentException(
                    "Patient ID must be a positive value"
            );
        }

        log.info(
                "Building AI health context. patientId={}",
                patientId
        );

        PatientDTO patient =
                patientClient.getPatientById(patientId);

        if (patient == null) {
            throw new IllegalArgumentException(
                    "Patient not found: " + patientId
            );
        }

        authorizePatientContextAccess(
                patientId,
                patient
        );

        PatientHealthContextDTO context =
                new PatientHealthContextDTO();

        context.setPatient(patient);

        List<AppointmentDTO> appointments =
                fetchAllAppointments(
                        patientId,
                        context
                );

        List<PrescriptionDTO> prescriptions =
                fetchPrescriptions(
                        patientId,
                        context
                );

        context.setAppointments(appointments);
        context.setPrescriptions(prescriptions);

        context.setTotalAppointments(
                appointments.size()
        );

        context.setCompletedAppointments(
                countAppointmentsByStatus(
                        appointments,
                        "COMPLETED"
                )
        );

        context.setCancelledAppointments(
                countAppointmentsByStatus(
                        appointments,
                        "CANCELLED"
                )
        );

        context.setTotalPrescriptions(
                prescriptions.size()
        );

        log.info(
                "AI health context built. patientId={}, appointments={}, prescriptions={}, warnings={}",
                patientId,
                appointments.size(),
                prescriptions.size(),
                context.getDataWarnings().size()
        );

        return context;
    }

    private List<AppointmentDTO> fetchAllAppointments(
            Long patientId,
            PatientHealthContextDTO context) {

        List<AppointmentDTO> appointments =
                new ArrayList<>();

        int page = 0;
        final int pageSize = 100;

        try {

            while (true) {

                AppointmentPageDTO appointmentPage =
                        appointmentClient.getAppointmentsByPatient(
                                patientId,
                                page,
                                pageSize
                        );

                if (appointmentPage == null) {
                    break;
                }

                List<AppointmentDTO> content =
                        appointmentPage.getContent();

                if (content == null
                        || content.isEmpty()) {
                    break;
                }

                appointments.addAll(content);

                if (appointmentPage.getTotalPages()
                        <= page + 1) {
                    break;
                }

                page++;
            }

            context.setAppointmentDataAvailable(true);

        } catch (Exception e) {

            context.setAppointmentDataAvailable(false);

            context.getDataWarnings().add(
                    "Appointment history is currently unavailable."
            );

            log.warn(
                    "Unable to retrieve appointment history. patientId={}",
                    patientId,
                    e
            );
        }

        return appointments;
    }

    private List<PrescriptionDTO> fetchPrescriptions(
            Long patientId,
            PatientHealthContextDTO context) {

        try {

            List<PrescriptionDTO> prescriptions =
                    prescriptionClient
                            .getPrescriptionsByPatient(
                                    patientId
                            );

            context.setPrescriptionDataAvailable(
                    true
            );

            if (prescriptions == null) {
                return Collections.emptyList();
            }

            return prescriptions;

        } catch (Exception e) {

            context.setPrescriptionDataAvailable(
                    false
            );

            context.getDataWarnings().add(
                    "Prescription history is currently unavailable."
            );

            log.warn(
                    "Unable to retrieve prescription history. patientId={}",
                    patientId,
                    e
            );

            return Collections.emptyList();
        }
    }

    private int countAppointmentsByStatus(
            List<AppointmentDTO> appointments,
            String status) {

        return (int) appointments.stream()
                .filter(appointment ->
                        appointment != null
                                && appointment.getStatus() != null
                                && status.equalsIgnoreCase(
                                appointment.getStatus()
                        )
                )
                .count();
    }

    private void authorizePatientContextAccess(
            Long patientId,
            PatientDTO patient) {

        String role =
                SecurityUtils.getCurrentRole();

        Long currentUserId =
                SecurityUtils.getCurrentUserId();

        if ("ROLE_ADMIN".equals(role)) {
            return;
        }

        if ("ROLE_PATIENT".equals(role)) {

            if (patient.getUserId() == null
                    || !patient.getUserId()
                    .equals(currentUserId)) {

                throw new AccessDeniedException(
                        "Patients can only access their own health information"
                );
            }

            return;
        }

        if ("ROLE_DOCTOR".equals(role)) {

            authorizeDoctorPatientAccess(
                    patientId,
                    currentUserId
            );

            return;
        }

        throw new AccessDeniedException(
                "Access denied"
        );
    }

    private void authorizeDoctorPatientAccess(
            Long patientId,
            Long currentUserId) {

        if (currentUserId == null) {
            throw new AccessDeniedException(
                    "Authenticated doctor identity is unavailable"
            );
        }

        List<AppointmentDTO> appointments =
                new ArrayList<>();

        int page = 0;
        final int pageSize = 100;

        try {

            while (true) {

                AppointmentPageDTO pageResult =
                        appointmentClient.getAppointmentsByPatient(
                                patientId,
                                page,
                                pageSize
                        );

                if (pageResult == null
                        || pageResult.getContent() == null
                        || pageResult.getContent().isEmpty()) {
                    break;
                }

                appointments.addAll(
                        pageResult.getContent()
                );

                if (pageResult.getTotalPages()
                        <= page + 1) {
                    break;
                }

                page++;
            }

        } catch (Exception e) {

            log.error(
                    "Unable to verify doctor-patient relationship. patientId={}, userId={}",
                    patientId,
                    currentUserId,
                    e
            );

            throw new AccessDeniedException(
                    "Unable to verify doctor access to this patient"
            );
        }

        boolean authorized =
                appointments.stream()
                        .map(AppointmentDTO::getDoctorId)
                        .filter(java.util.Objects::nonNull)
                        .distinct()
                        .anyMatch(doctorId ->
                                isDoctorOwnedByUser(
                                        doctorId,
                                        currentUserId
                                )
                        );

        if (!authorized) {

            throw new AccessDeniedException(
                    "Doctors can only access patients associated with their clinical appointments"
            );
        }
    }

    private boolean isDoctorOwnedByUser(
            Long doctorId,
            Long currentUserId) {

        try {

            DoctorDTO doctor =
                    doctorClient.getDoctorById(
                            doctorId
                    );

            return doctor != null
                    && doctor.getUserId() != null
                    && doctor.getUserId()
                    .equals(currentUserId);

        } catch (Exception e) {

            log.warn(
                    "Unable to verify doctor ownership. doctorId={}, userId={}",
                    doctorId,
                    currentUserId,
                    e
            );

            return false;
        }
    }
}