package com.hms.doctorservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hms.doctorservice.client.AuthClient;
import com.hms.doctorservice.client.NotificationClient;
import com.hms.doctorservice.dto.AuthApiResponse;
import com.hms.doctorservice.dto.AuthResponse;
import com.hms.doctorservice.dto.DoctorDTO;
import com.hms.doctorservice.dto.DoctorResponseDTO;
import com.hms.doctorservice.dto.EmailNotificationDTO;
import com.hms.doctorservice.dto.RegisterRequest;
import com.hms.doctorservice.exception.ResourceNotFoundException;
import com.hms.doctorservice.model.Doctor;
import com.hms.doctorservice.repository.DoctorRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    private AuthClient authClient;

    public DoctorResponseDTO createDoctor(DoctorDTO dto) {

        log.info(
                "Doctor registration requested. email={}, speciality={}",
                dto.getEmail(),
                dto.getSpeciality()
        );

        Doctor doctor = new Doctor();

        doctor.setName(dto.getName());
        doctor.setEmail(dto.getEmail());
        doctor.setContact(dto.getContact());
        doctor.setSpeciality(dto.getSpeciality());
        doctor.setQualification(dto.getQualification());
        doctor.setAvailability(dto.getAvailability());

        log.debug(
                "Calling Auth Service to create doctor user. email={}",
                dto.getEmail()
        );

        try {

            RegisterRequest req =
                    new RegisterRequest();

            req.setEmail(dto.getEmail());
            req.setPassword("Temp@123");
            req.setRole("DOCTOR");
            req.setName(dto.getName());

            AuthApiResponse response =
                    authClient.register(req);

            if (response != null &&
                    response.getData() != null) {

                AuthResponse authUser =
                        response.getData();

                doctor.setUserId(
                        authUser.getId()
                );

                log.info(
                        "Auth user created successfully. userId={}, email={}",
                        authUser.getId(),
                        authUser.getEmail()
                );
            }

        } catch (Exception e) {

            log.warn(
                    "Auth service failed while registering doctor. email={}",
                    dto.getEmail(),
                    e
            );
        }

        Doctor saved =
                doctorRepository.save(doctor);

        log.info(
                "Doctor created successfully. doctorId={}, userId={}",
                saved.getId(),
                saved.getUserId()
        );

        log.debug(
                "Sending doctor registration notification. doctorId={}",
                saved.getId()
        );

        try {

            EmailNotificationDTO email =
                    new EmailNotificationDTO();

            email.setTo(dto.getEmail());

            email.setSubject(
                    "Welcome Dr. " + dto.getName()
            );

            email.setBody(
                    "Your doctor profile has been successfully created."
            );

            notificationClient.sendEmail(email);

            log.info(
                    "Doctor registration notification sent successfully. doctorId={}",
                    saved.getId()
            );

        } catch (Exception ex) {

            log.warn(
                    "Notification service unavailable for doctor. doctorId={}",
                    saved.getId(),
                    ex
            );
        }

        return mapToResponseDTO(saved);
    }

    public Page<DoctorResponseDTO> getAll(
            Pageable pageable,
            String speciality) {

        log.debug(
                "Fetching doctors. page={}, size={}, sort={}, speciality={}",
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSort(),
                speciality
        );

        Page<Doctor> doctors;

        if (speciality != null && !speciality.trim().isEmpty()) {

            doctors =
                    doctorRepository.findBySpecialityIgnoreCase(
                            speciality.trim(),
                            pageable
                    );

        } else {

            doctors =
                    doctorRepository.findAll(pageable);
        }

        log.info(
                "Doctors fetched successfully. page={}, size={}, totalElements={}",
                pageable.getPageNumber(),
                pageable.getPageSize(),
                doctors.getTotalElements()
        );

        return doctors.map(this::mapToResponseDTO);
    }

    public DoctorResponseDTO update(
            Long id,
            DoctorDTO dto) {

        log.info(
                "Doctor update requested. doctorId={}",
                id
        );

        Doctor doctor =
                doctorRepository.findById(id)
                    .orElseThrow(() -> {

                        log.warn(
                                "Doctor update failed. Doctor not found. doctorId={}",
                                id
                        );

                        return new ResourceNotFoundException(
                                "Doctor not found with ID: " + id
                        );
                    });

        doctor.setName(dto.getName());
        doctor.setEmail(dto.getEmail());
        doctor.setContact(dto.getContact());
        doctor.setQualification(dto.getQualification());
        doctor.setSpeciality(dto.getSpeciality());
        doctor.setAvailability(dto.getAvailability());

        Doctor saved =
                doctorRepository.save(doctor);

        log.info(
                "Doctor updated successfully. doctorId={}",
                saved.getId()
        );

        return mapToResponseDTO(saved);
    }

    public DoctorResponseDTO getDoctorById(
            Long id) {

        log.debug(
                "Fetching doctor. doctorId={}",
                id
        );

        Doctor doctor =
                doctorRepository.findById(id)
                    .orElseThrow(() -> {

                        log.warn(
                                "Doctor not found. doctorId={}",
                                id
                        );

                        return new ResourceNotFoundException(
                                "Doctor not found with ID: " + id
                        );
                    });

        return mapToResponseDTO(doctor);
    }

//    public List<DoctorResponseDTO> getDoctorsBySpeciality(
//            String speciality) {
//
//        log.debug(
//                "Fetching doctors by speciality. speciality={}",
//                speciality
//        );
//
//        List<DoctorResponseDTO> doctors =
//                doctorRepository
//                        .findBySpeciality(speciality)
//                        .stream()
//                        .map(this::mapToResponseDTO)
//                        .toList();
//
//        log.info(
//                "Doctors fetched by speciality. speciality={}, count={}",
//                speciality,
//                doctors.size()
//        );
//
//        return doctors;
//    }

    public DoctorResponseDTO getByUserId(
            Long userId) {

        log.debug(
                "Fetching doctor by userId. userId={}",
                userId
        );

        Doctor doctor =
                doctorRepository
                    .findByUserId(userId)
                    .orElseThrow(() -> {

                        log.warn(
                                "Doctor not found for userId={}",
                                userId
                        );

                        return new ResourceNotFoundException(
                                "Doctor not found for user ID: "
                                + userId
                        );
                    });

        return mapToResponseDTO(doctor);
    }

    public DoctorResponseDTO updateAvailability(
            Long id,
            List<String> newAvailability) {

        log.info(
                "Doctor availability update requested. doctorId={}",
                id
        );

        Doctor doctor =
                doctorRepository.findById(id)
                    .orElseThrow(() -> {

                        log.warn(
                                "Availability update failed. Doctor not found. doctorId={}",
                                id
                        );

                        return new ResourceNotFoundException(
                                "Doctor not found with ID: " + id
                        );
                    });

        doctor.setAvailability(
                newAvailability
        );

        Doctor saved =
                doctorRepository.save(doctor);

        log.info(
                "Doctor availability updated successfully. doctorId={}",
                saved.getId()
        );

        return mapToResponseDTO(saved);
    }

    private DoctorResponseDTO mapToResponseDTO(
            Doctor doctor) {

        DoctorResponseDTO response =
                new DoctorResponseDTO();

        response.setId(doctor.getId());
        response.setName(doctor.getName());
        response.setEmail(doctor.getEmail());
        response.setContact(doctor.getContact());
        response.setSpeciality(doctor.getSpeciality());
        response.setQualification(doctor.getQualification());
        response.setUserId(doctor.getUserId());
        response.setAvailability(
                doctor.getAvailability()
        );

        return response;
    }
}