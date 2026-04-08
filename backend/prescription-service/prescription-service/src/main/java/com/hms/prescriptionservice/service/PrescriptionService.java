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

@Service
public class PrescriptionService {

    private final PrescriptionRepository repo;
    private final PatientClient patientClient;
    private final DoctorClient doctorClient;
    private final NotificationClient notificationClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public PrescriptionService(PrescriptionRepository repo,
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
        // Validate patient
        PatientDTO patient = patientClient.getPatientById(dto.getPatientId());
        if (patient == null) {
            throw new RuntimeException("Patient not found: " + dto.getPatientId());
        }

        // Validate doctor
        DoctorDTO doctor = doctorClient.getDoctorById(dto.getDoctorId());
        if (doctor == null) {
            throw new RuntimeException("Doctor not found: " + dto.getDoctorId());
        }

        Prescription entity = new Prescription();
        entity.setAppointmentId(dto.getAppointmentId());
        entity.setPatientId(dto.getPatientId());
        entity.setDoctorId(dto.getDoctorId());
        entity.setSymptoms(dto.getSymptoms());
        entity.setDiagnosis(dto.getDiagnosis());

        try {
            entity.setMedicinesJson(mapper.writeValueAsString(dto.getMedicines()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize medicines", e);
        }

        entity.setFollowUpDate(dto.getFollowUpDate());
        entity.setNotes(dto.getNotes());

        Prescription saved = repo.save(entity);

        // Send notification (EMAIL + SMS via notification-service)
        sendNotifications(patient, doctor, saved);

        return toDto(saved);
    }

    public PrescriptionDTO getById(Long id) {
        Prescription entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found: " + id));
        return toDto(entity);
    }

    public List<PrescriptionDTO> getByPatient(Long patientId) {
        return repo.findByPatientId(patientId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<PrescriptionDTO> getByDoctor(Long doctorId) {
        return repo.findByDoctorId(doctorId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private PrescriptionDTO toDto(Prescription entity) {
        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(entity.getId());
        dto.setAppointmentId(entity.getAppointmentId());
        dto.setPatientId(entity.getPatientId());
        dto.setDoctorId(entity.getDoctorId());
        dto.setSymptoms(entity.getSymptoms());
        dto.setDiagnosis(entity.getDiagnosis());
        dto.setFollowUpDate(entity.getFollowUpDate());
        dto.setNotes(entity.getNotes());

        try {
            List<MedicineDTO> meds = mapper.readValue(
                    entity.getMedicinesJson() == null ? "[]" : entity.getMedicinesJson(),
                    new TypeReference<List<MedicineDTO>>() {}
            );
            dto.setMedicines(meds);
        } catch (Exception e) {
            dto.setMedicines(List.of());
        }
        return dto;
    }

    private void sendNotifications(PatientDTO patient, DoctorDTO doctor, Prescription saved) {
        NotificationDTO notifyEmail = new NotificationDTO();
        notifyEmail.setRecipientId(patient.getId());
        notifyEmail.setRecipientEmail(patient.getEmail());
        notifyEmail.setRecipientContact(null);
        notifyEmail.setType("EMAIL");
        notifyEmail.setMessage("New prescription created by Dr. " +
                doctor.getName() + ". Login to HMS to view details.");
        try {
            notificationClient.send(notifyEmail);
        } catch (Exception e) {
            System.err.println("Failed to send prescription email notification: " + e.getMessage());
        }

        if (patient.getContact() != null) {
            String contact = patient.getContact();
            if (!contact.startsWith("+")) {
                contact = "+91" + contact;
            }
            NotificationDTO notifySms = new NotificationDTO();
            notifySms.setRecipientId(patient.getId());
            notifySms.setRecipientContact(contact);
            notifySms.setRecipientEmail(null);
            notifySms.setType("SMS");
            notifySms.setMessage("New prescription from Dr. " + doctor.getName() + " has been created.");
            try {
                notificationClient.send(notifySms);
            } catch (Exception e) {
                System.err.println("Failed to send prescription SMS notification: " + e.getMessage());
            }
        }
    }
}
