package com.hms.patientservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.hms.patientservice.client.AuthClient;
import com.hms.patientservice.client.NotificationClient;
import com.hms.patientservice.dto.AuthApiResponse;
import com.hms.patientservice.dto.NotificationDTO;
import com.hms.patientservice.dto.PatientDTO;
import com.hms.patientservice.dto.PatientResponseDTO;
import com.hms.patientservice.dto.RegisterRequest;
import com.hms.patientservice.model.Patient;
import com.hms.patientservice.repository.PatientRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    private AuthClient authClient;

    public PatientDTO create(PatientDTO dto) {

        Patient patient = new Patient();

        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setGender(dto.getGender());
        patient.setDob(dto.getDob());
        patient.setContact(dto.getContact());

        try {
            RegisterRequest req = new RegisterRequest();

            req.setEmail(dto.getEmail());
            req.setPassword("Temp@123");
            req.setRole("PATIENT");
            req.setName(dto.getName());

            AuthApiResponse response = authClient.register(req);

            if (response != null && response.getData() != null) {
                patient.setUserId(response.getData().getId());
            }

        } catch (Exception e) {
            log.warn(
                "Auth service failed while registering patient: {}",
                dto.getEmail(),
                e
            );
        }

        Patient saved = patientRepository.save(patient);

        try {

            NotificationDTO notification = new NotificationDTO();

            notification.setRecipientId(saved.getId());
            notification.setRecipientEmail(saved.getEmail());

            String contact = saved.getContact();

            if (contact != null && !contact.startsWith("+")) {
                contact = "+91" + contact;
            }

            notification.setRecipientContact(contact);
            notification.setType("SMS");
            notification.setMessage(
                "Welcome to our Healthcare System, "
                + saved.getName()
            );

            notificationClient.send(notification);

        } catch (Exception e) {

            log.warn(
                "Notification service unavailable for patient {}",
                saved.getId(),
                e
            );
        }

        PatientDTO response = new PatientDTO();

        response.setId(saved.getId());
        response.setUserId(saved.getUserId());
        response.setName(saved.getName());
        response.setEmail(saved.getEmail());
        response.setGender(saved.getGender());
        response.setDob(saved.getDob());
        response.setContact(saved.getContact());

        return response;
    }

    public List<Patient> getAll() {
        return patientRepository.findAll();
    }

    public PatientResponseDTO update(Long id, PatientDTO dto) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Patient not found")
                );

        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setGender(dto.getGender());
        patient.setDob(dto.getDob());
        patient.setContact(dto.getContact());

        Patient saved = patientRepository.save(patient);

        return mapToResponseDTO(saved);
    }

    public PatientResponseDTO getPatient(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Patient not found")
                );

        return mapToResponseDTO(patient);
    }

    public Page<PatientResponseDTO> getAllPaged(
            int page,
            int size,
            String search) {

        Pageable pageable =
                PageRequest.of(
                    page,
                    size,
                    Sort.by("id").descending()
                );

        Page<Patient> patients;

        if (search != null && !search.isEmpty()) {

            patients =
                patientRepository
                    .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        search,
                        search,
                        pageable
                    );

        } else {

            patients =
                patientRepository.findAll(pageable);
        }

        return patients.map(this::mapToResponseDTO);
    }

    public PatientResponseDTO getByUserId(Long userId) {

        Patient patient =
            patientRepository.findByUserId(userId)
                .orElseThrow(() ->
                    new RuntimeException("Patient not found")
                );

        return mapToResponseDTO(patient);
    }

    private PatientResponseDTO mapToResponseDTO(
            Patient patient) {

        PatientResponseDTO response =
            new PatientResponseDTO();

        response.setId(patient.getId());
        response.setUserId(patient.getUserId());
        response.setName(patient.getName());
        response.setEmail(patient.getEmail());
        response.setContact(patient.getContact());
        response.setGender(patient.getGender());
        response.setDob(patient.getDob());

        return response;
    }
}