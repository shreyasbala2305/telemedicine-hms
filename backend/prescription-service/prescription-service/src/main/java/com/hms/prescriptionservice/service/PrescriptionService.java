package com.hms.prescriptionservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.prescriptionservice.client.DoctorClient;
import com.hms.prescriptionservice.client.NotificationClient;
import com.hms.prescriptionservice.client.PatientClient;
import com.hms.prescriptionservice.dto.DoctorDTO;
import com.hms.prescriptionservice.dto.MedicineDTO;
import com.hms.prescriptionservice.dto.NotificationDTO;
import com.hms.prescriptionservice.dto.PatientDTO;
import com.hms.prescriptionservice.dto.PrescriptionDTO;
import com.hms.prescriptionservice.model.Prescription;
import com.hms.prescriptionservice.respository.PrescriptionRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PrescriptionService {

    private final PrescriptionRepository repo;
    private final PatientClient patientClient;
    private final DoctorClient doctorClient;
    private final NotificationClient notificationClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public PrescriptionService(
            PrescriptionRepository repo,
            PatientClient patientClient,
            DoctorClient doctorClient,
            NotificationClient notificationClient) {

        this.repo = repo;
        this.patientClient = patientClient;
        this.doctorClient = doctorClient;
        this.notificationClient = notificationClient;
    }

    @Transactional
    public PrescriptionDTO create(PrescriptionDTO dto) {

        log.info(
                "Prescription creation requested. patientId={}, doctorId={}, appointmentId={}",
                dto.getPatientId(),
                dto.getDoctorId(),
                dto.getAppointmentId()
        );

        // Validate patient
        log.debug(
                "Validating patient through Patient Service. patientId={}",
                dto.getPatientId()
        );

        PatientDTO patient =
                patientClient.getPatientById(
                        dto.getPatientId()
                );

        if (patient == null) {

            log.warn(
                    "Prescription creation failed. Patient not found. patientId={}",
                    dto.getPatientId()
            );

            throw new RuntimeException(
                    "Patient not found: " + dto.getPatientId()
            );
        }

        // Validate doctor
        log.debug(
                "Validating doctor through Doctor Service. doctorId={}",
                dto.getDoctorId()
        );

        DoctorDTO doctor =
                doctorClient.getDoctorById(
                        dto.getDoctorId()
                );

        if (doctor == null) {

            log.warn(
                    "Prescription creation failed. Doctor not found. doctorId={}",
                    dto.getDoctorId()
            );

            throw new RuntimeException(
                    "Doctor not found: " + dto.getDoctorId()
            );
        }

        Prescription entity = new Prescription();

        entity.setAppointmentId(
                dto.getAppointmentId()
        );

        entity.setPatientId(
                dto.getPatientId()
        );

        entity.setDoctorId(
                dto.getDoctorId()
        );

        entity.setSymptoms(
                dto.getSymptoms()
        );

        entity.setDiagnosis(
                dto.getDiagnosis()
        );

        try {

            entity.setMedicinesJson(
                    mapper.writeValueAsString(
                            dto.getMedicines()
                    )
            );

        } catch (Exception e) {

            log.error(
                    "Failed to serialize prescription medicines. patientId={}, doctorId={}",
                    dto.getPatientId(),
                    dto.getDoctorId(),
                    e
            );

            throw new RuntimeException(
                    "Failed to serialize medicines",
                    e
            );
        }

        entity.setFollowUpDate(
                dto.getFollowUpDate()
        );

        entity.setNotes(
                dto.getNotes()
        );

        Prescription saved =
                repo.save(entity);

        log.info(
                "Prescription created successfully. prescriptionId={}, patientId={}, doctorId={}",
                saved.getId(),
                saved.getPatientId(),
                saved.getDoctorId()
        );

        // Send notification
        sendNotifications(
                patient,
                doctor,
                saved
        );

        return toDto(saved);
    }

    public PrescriptionDTO getById(Long id) {

        log.debug(
                "Fetching prescription. prescriptionId={}",
                id
        );

        Prescription entity =
                repo.findById(id)
                        .orElseThrow(() -> {

                            log.warn(
                                    "Prescription not found. prescriptionId={}",
                                    id
                            );

                            return new RuntimeException(
                                    "Prescription not found: " + id
                            );
                        });

        return toDto(entity);
    }

    public List<PrescriptionDTO> getByPatient(
            Long patientId) {

        log.debug(
                "Fetching prescriptions for patient. patientId={}",
                patientId
        );

        List<PrescriptionDTO> prescriptions =
                repo.findByPatientId(patientId)
                        .stream()
                        .map(this::toDto)
                        .collect(Collectors.toList());

        log.info(
                "Prescriptions fetched for patient. patientId={}, count={}",
                patientId,
                prescriptions.size()
        );

        return prescriptions;
    }

    public List<PrescriptionDTO> getByDoctor(
            Long doctorId) {

        log.debug(
                "Fetching prescriptions for doctor. doctorId={}",
                doctorId
        );

        List<PrescriptionDTO> prescriptions =
                repo.findByDoctorId(doctorId)
                        .stream()
                        .map(this::toDto)
                        .collect(Collectors.toList());

        log.info(
                "Prescriptions fetched for doctor. doctorId={}, count={}",
                doctorId,
                prescriptions.size()
        );

        return prescriptions;
    }

    private PrescriptionDTO toDto(
            Prescription entity) {

        PrescriptionDTO dto =
                new PrescriptionDTO();

        dto.setId(entity.getId());
        dto.setAppointmentId(
                entity.getAppointmentId()
        );
        dto.setPatientId(
                entity.getPatientId()
        );
        dto.setDoctorId(
                entity.getDoctorId()
        );
        dto.setSymptoms(
                entity.getSymptoms()
        );
        dto.setDiagnosis(
                entity.getDiagnosis()
        );
        dto.setFollowUpDate(
                entity.getFollowUpDate()
        );
        dto.setNotes(
                entity.getNotes()
        );

        try {

            List<MedicineDTO> meds =
                    mapper.readValue(
                            entity.getMedicinesJson() == null
                                    ? "[]"
                                    : entity.getMedicinesJson(),
                            new TypeReference<List<MedicineDTO>>() {}
                    );

            dto.setMedicines(meds);

        } catch (Exception e) {

            log.error(
                    "Failed to deserialize prescription medicines. prescriptionId={}",
                    entity.getId(),
                    e
            );

            dto.setMedicines(
                    List.of()
            );
        }

        return dto;
    }

    private void sendNotifications(
            PatientDTO patient,
            DoctorDTO doctor,
            Prescription saved) {

        log.debug(
                "Sending prescription notifications. prescriptionId={}, patientId={}",
                saved.getId(),
                patient.getId()
        );

        // EMAIL
        NotificationDTO notifyEmail =
                new NotificationDTO();

        notifyEmail.setRecipientId(
                patient.getId()
        );

        notifyEmail.setRecipientEmail(
                patient.getEmail()
        );

        notifyEmail.setRecipientContact(
                null
        );

        notifyEmail.setType(
                "EMAIL"
        );

        notifyEmail.setMessage(
                "New prescription created by Dr. "
                + doctor.getName()
                + ". Login to HMS to view details."
        );

        try {

            notificationClient.send(
                    notifyEmail
            );

            log.info(
                    "Prescription email notification sent successfully. prescriptionId={}, patientId={}",
                    saved.getId(),
                    patient.getId()
            );

        } catch (Exception e) {

            log.error(
                    "Failed to send prescription email notification. prescriptionId={}, patientId={}",
                    saved.getId(),
                    patient.getId(),
                    e
            );
        }

        // SMS
        if (patient.getContact() != null) {

            String contact =
                    patient.getContact();

            if (!contact.startsWith("+")) {
                contact = "+91" + contact;
            }

            NotificationDTO notifySms =
                    new NotificationDTO();

            notifySms.setRecipientId(
                    patient.getId()
            );

            notifySms.setRecipientContact(
                    contact
            );

            notifySms.setRecipientEmail(
                    null
            );

            notifySms.setType(
                    "SMS"
            );

            notifySms.setMessage(
                    "New prescription from Dr. "
                    + doctor.getName()
                    + " has been created."
            );

            try {

                notificationClient.send(
                        notifySms
                );

                log.info(
                        "Prescription SMS notification sent successfully. prescriptionId={}, patientId={}",
                        saved.getId(),
                        patient.getId()
                );

            } catch (Exception e) {

                log.error(
                        "Failed to send prescription SMS notification. prescriptionId={}, patientId={}",
                        saved.getId(),
                        patient.getId(),
                        e
                );
            }
        }
    }
}