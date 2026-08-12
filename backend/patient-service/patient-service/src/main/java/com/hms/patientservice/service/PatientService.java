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
import com.hms.patientservice.exception.ResourceNotFoundException;
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

        log.info(
                "Patient registration requested. email={}",
                dto.getEmail()
        );

        Patient patient = new Patient();

        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setGender(dto.getGender());
        patient.setDob(dto.getDob());
        patient.setContact(dto.getContact());

        /*
         * Create corresponding authentication user.
         */
        log.debug(
                "Calling Auth Service to create patient user. email={}",
                dto.getEmail()
        );

        try {

            RegisterRequest req = new RegisterRequest();

            req.setEmail(dto.getEmail());
            req.setPassword("Temp@123");
            req.setRole("PATIENT");
            req.setName(dto.getName());

            AuthApiResponse response =
                    authClient.register(req);

            if (response != null &&
                    response.getData() != null) {

                patient.setUserId(
                        response.getData().getId()
                );

                log.info(
                        "Auth user created successfully for patient. userId={}",
                        response.getData().getId()
                );
            }

        } catch (Exception e) {

            log.warn(
                    "Auth service unavailable while registering patient. email={}",
                    dto.getEmail(),
                    e
            );
        }

        Patient saved =
                patientRepository.save(patient);

        log.info(
                "Patient created successfully. patientId={}",
                saved.getId()
        );

        /*
         * Send welcome notification.
         */
        log.debug(
                "Sending patient registration notification. patientId={}",
                saved.getId()
        );

        try {

            NotificationDTO notification =
                    new NotificationDTO();

            notification.setRecipientId(
                    saved.getId()
            );

            notification.setRecipientEmail(
                    saved.getEmail()
            );

            String contact =
                    saved.getContact();

            if (contact != null &&
                    !contact.startsWith("+")) {

                contact = "+91" + contact;
            }

            notification.setRecipientContact(
                    contact
            );

            notification.setType("SMS");

            notification.setMessage(
                    "Welcome to our Healthcare System, "
                    + saved.getName()
            );

            notificationClient.send(notification);

            log.info(
                    "Patient registration notification sent successfully. patientId={}",
                    saved.getId()
            );

        } catch (Exception e) {

            log.warn(
                    "Notification service unavailable for patient. patientId={}",
                    saved.getId(),
                    e
            );
        }

        PatientDTO response =
                new PatientDTO();

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

        log.debug("Fetching all patients");

        List<Patient> patients =
                patientRepository.findAll();

        log.info(
                "Patients fetched successfully. count={}",
                patients.size()
        );

        return patients;
    }

    public PatientResponseDTO update(
            Long id,
            PatientDTO dto) {

        log.info(
                "Patient update requested. patientId={}",
                id
        );

        Patient patient =
                patientRepository.findById(id)
                    .orElseThrow(() -> {

                        log.warn(
                                "Patient update failed. Patient not found. patientId={}",
                                id
                        );

                        return new ResourceNotFoundException(
                                "Patient not found with ID: " + id
                        );
                    });

        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setGender(dto.getGender());
        patient.setDob(dto.getDob());
        patient.setContact(dto.getContact());

        Patient saved =
                patientRepository.save(patient);

        log.info(
                "Patient updated successfully. patientId={}",
                saved.getId()
        );

        return mapToResponseDTO(saved);
    }

    public PatientResponseDTO getPatient(
            Long id) {

        log.debug(
                "Fetching patient. patientId={}",
                id
        );

        Patient patient =
                patientRepository.findById(id)
                    .orElseThrow(() -> {

                        log.warn(
                                "Patient not found. patientId={}",
                                id
                        );

                        return new ResourceNotFoundException(
                                "Patient not found with ID: " + id
                        );
                    });

        return mapToResponseDTO(patient);
    }

    public Page<PatientResponseDTO> getAllPaged(
            int page,
            int size,
            String search) {

        log.debug(
                "Fetching patients. page={}, size={}, searchProvided={}",
                page,
                size,
                search != null && !search.trim().isEmpty()
        );

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("id").descending()
                );

        Page<Patient> patients;

        if (search != null &&
                !search.trim().isEmpty()) {

            patients =
                    patientRepository
                        .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                                search,
                                search,
                                pageable
                        );

        } else {

            patients =
                    patientRepository.findAll(
                            pageable
                    );
        }

        log.info(
                "Patient search completed. page={}, size={}, results={}",
                page,
                size,
                patients.getNumberOfElements()
        );

        return patients.map(
                this::mapToResponseDTO
        );
    }

    public PatientResponseDTO getByUserId(
            Long userId) {

        log.debug(
                "Fetching patient by userId. userId={}",
                userId
        );

        Patient patient =
                patientRepository
                    .findByUserId(userId)
                    .orElseThrow(() -> {

                        log.warn(
                                "Patient not found for userId={}",
                                userId
                        );

                        return new ResourceNotFoundException(
                                "Patient not found for user ID: "
                                + userId
                        );
                    });

        return mapToResponseDTO(patient);
    }

    private PatientResponseDTO mapToResponseDTO(
            Patient patient) {

        PatientResponseDTO response =
                new PatientResponseDTO();

        response.setId(patient.getId());

        response.setUserId(
                patient.getUserId()
        );

        response.setName(
                patient.getName()
        );

        response.setEmail(
                patient.getEmail()
        );

        response.setContact(
                patient.getContact()
        );

        response.setGender(
                patient.getGender()
        );

        response.setDob(
                patient.getDob()
        );

        return response;
    }
}