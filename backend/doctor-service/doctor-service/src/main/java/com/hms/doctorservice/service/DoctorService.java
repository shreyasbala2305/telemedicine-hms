package com.hms.doctorservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.doctorservice.client.AuthClient;
import com.hms.doctorservice.client.NotificationClient;
import com.hms.doctorservice.dto.AuthApiResponse;
import com.hms.doctorservice.dto.AuthResponse;
import com.hms.doctorservice.dto.DoctorDTO;
import com.hms.doctorservice.dto.DoctorResponseDTO;
import com.hms.doctorservice.dto.EmailNotificationDTO;
import com.hms.doctorservice.dto.RegisterRequest;
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

        Doctor doctor = new Doctor();

        doctor.setName(dto.getName());
        doctor.setEmail(dto.getEmail());
        doctor.setContact(dto.getContact());
        doctor.setSpeciality(dto.getSpeciality());
        doctor.setQualification(dto.getQualification());
        doctor.setAvailability(dto.getAvailability());

        try {

            RegisterRequest req = new RegisterRequest();

            req.setEmail(dto.getEmail());
            req.setPassword("Temp@123");
            req.setRole("DOCTOR");
            req.setName(dto.getName());

            AuthApiResponse response = authClient.register(req);

            if (response != null && response.getData() != null) {

                AuthResponse authUser = response.getData();

                doctor.setUserId(authUser.getId());

                log.info(
                    "Auth user created successfully. userId={}, email={}",
                    authUser.getId(),
                    authUser.getEmail()
                );
            }

        } catch (Exception e) {

            log.warn(
                    "Auth service failed while registering doctor: {}",
                    dto.getEmail(),
                    e
            );
        }

        Doctor saved = doctorRepository.save(doctor);

        log.info(
                "Doctor saved successfully. doctorId={}, userId={}",
                saved.getId(),
                saved.getUserId()
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

        } catch (Exception ex) {

            log.warn(
                    "Notification service unavailable for doctor {}: {}",
                    saved.getId(),
                    ex.getMessage()
            );
        }

        return mapToResponseDTO(saved);
    }

    public List<DoctorResponseDTO> getAll() {

        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public DoctorResponseDTO update(
            Long id,
            DoctorDTO dto) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        doctor.setName(dto.getName());
        doctor.setEmail(dto.getEmail());
        doctor.setContact(dto.getContact());
        doctor.setQualification(dto.getQualification());
        doctor.setSpeciality(dto.getSpeciality());
        doctor.setAvailability(dto.getAvailability());

        Doctor saved = doctorRepository.save(doctor);

        return mapToResponseDTO(saved);
    }

    public DoctorResponseDTO getDoctorById(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        return mapToResponseDTO(doctor);
    }

    public List<DoctorResponseDTO> getDoctorsBySpeciality(
            String speciality) {

        return doctorRepository
                .findBySpeciality(speciality)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public DoctorResponseDTO getByUserId(Long userId) {

        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        return mapToResponseDTO(doctor);
    }

    public DoctorResponseDTO updateAvailability(
            Long id,
            List<String> newAvailability) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        doctor.setAvailability(newAvailability);

        Doctor saved = doctorRepository.save(doctor);

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
        response.setAvailability(doctor.getAvailability());

        return response;
    }
}