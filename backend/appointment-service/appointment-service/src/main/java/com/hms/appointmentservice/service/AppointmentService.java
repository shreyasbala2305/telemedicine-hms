package com.hms.appointmentservice.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.hms.appointmentservice.client.DoctorClient;
import com.hms.appointmentservice.client.NotificationClient;
import com.hms.appointmentservice.client.PatientClient;
import com.hms.appointmentservice.dto.AppointmentDTO;
import com.hms.appointmentservice.dto.AppointmentResponseDTO;
import com.hms.appointmentservice.dto.DoctorDTO;
import com.hms.appointmentservice.dto.EmailNotificationDTO;
import com.hms.appointmentservice.dto.MessageNotificationDTO;
import com.hms.appointmentservice.dto.PatientDTO;
import com.hms.appointmentservice.exception.AppointmentNotFoundException;
import com.hms.appointmentservice.exception.ResourceNotFoundException;
import com.hms.appointmentservice.exception.SlotAlreadyBookedException;
import com.hms.appointmentservice.model.Appointment;
import com.hms.appointmentservice.repository.AppointmentRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientClient patientClient;

    @Autowired
    private DoctorClient doctorClient;

    @Autowired
    private NotificationClient notificationClient;

    public AppointmentResponseDTO bookAppointment(
            AppointmentDTO dto) {

        Long patientId = dto.getPatientId();
        Long doctorId = dto.getDoctorId();
        LocalDateTime dateTime = dto.getDateTime();
        
        log.info(
                "Appointment booking requested. patientId={}, doctorId={}, dateTime={}",
                patientId,
                doctorId,
                dateTime
        );

        // Validate patient
        PatientDTO patient =
                patientClient.getPatientById(patientId);

        if (patient == null) {
        	log.warn(
                    "Appointment booking rejected. Patient not found. patientId={}",
                    patientId
            );
            throw new ResourceNotFoundException(
                    "Patient not found with ID: " + patientId
            );
        }

        // Validate doctor
        log.debug(
                "Validating doctor. doctorId={}",
                doctorId
        );
        
        DoctorDTO doctor =
                doctorClient.getDoctorById(doctorId);

        if (doctor == null) {
        	log.warn(
                    "Appointment booking rejected. Doctor not found. doctorId={}",
                    doctorId
            );
        	
            throw new ResourceNotFoundException(
                    "Doctor not found with ID: " + doctorId
            );
        }

        // Prevent double booking
        log.debug(
                "Checking appointment slot availability. doctorId={}, dateTime={}",
                doctorId,
                dateTime
        );
        
        boolean conflict =
                appointmentRepository
                        .existsByDoctorIdAndDateTime(
                                doctorId,
                                dateTime
                        );

        if (conflict) {
        	log.warn(
                    "Appointment booking rejected because slot is already booked. doctorId={}, dateTime={}",
                    doctorId,
                    dateTime
            );
        	
            throw new SlotAlreadyBookedException(
                    "Slot already booked for this doctor at "
                            + dateTime
            );
        }

        Appointment appointment =
                new Appointment();

        appointment.setPatientId(patientId);
        appointment.setDoctorId(doctorId);
        appointment.setDateTime(dateTime);

        /*
         * Patient booking starts as PENDING.
         *
         * Receptionist later changes:
         *
         * PENDING -> CONFIRMED
         */
        appointment.setStatus(
                Appointment.Status.PENDING
        );

        Appointment saved =
                appointmentRepository.save(appointment);

        log.info(
                "Appointment created successfully. appointmentId={}, patientId={}, doctorId={}, dateTime={}, status={}",
                saved.getId(),
                saved.getPatientId(),
                saved.getDoctorId(),
                saved.getDateTime(),
                saved.getStatus()
        );

        // Email notification
        EmailNotificationDTO email =
                new EmailNotificationDTO();

        email.setTo(patient.getEmail());
        email.setSubject("Appointment Request Received");
        email.setBody(
                "Your appointment request with Dr. "
                        + doctor.getName()
                        + " has been received and is pending confirmation."
        );

        try {

            notificationClient.sendEmail(email);

        } catch (Exception e) {

            log.warn(
                    "Failed to send appointment email notification for appointment {}",
                    saved.getId(),
                    e
            );
        }

        // SMS notification
        MessageNotificationDTO message =
                new MessageNotificationDTO();

        message.setPhoneNumber(patient.getContact());
        message.setMessage(
                "Your appointment request with Dr. "
                        + doctor.getName()
                        + " is pending confirmation."
        );

        try {

            notificationClient.sendMessage(message);

        } catch (Exception e) {

            log.warn(
                    "Failed to send appointment SMS notification for appointment {}",
                    saved.getId(),
                    e
            );
        }

        return mapToResponseDTO(saved);
    }

    public Page<AppointmentResponseDTO> getByPatient(
            Long patientId,
            Pageable pageable) {

        log.debug(
                "Fetching patient appointments. patientId={}, page={}, size={}, sort={}",
                patientId,
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSort()
        );

        Page<Appointment> appointments =
                appointmentRepository.findByPatientId(
                        patientId,
                        pageable
                );

        log.info(
                "Patient appointments fetched. patientId={}, totalElements={}",
                patientId,
                appointments.getTotalElements()
        );

        return appointments.map(this::mapToResponseDTO);
    }

    public Page<AppointmentResponseDTO> getByDoctor(
            Long doctorId,
            Pageable pageable) {

        log.debug(
                "Fetching doctor appointments. doctorId={}, page={}, size={}, sort={}",
                doctorId,
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSort()
        );

        Page<Appointment> appointments =
                appointmentRepository.findByDoctorId(
                        doctorId,
                        pageable
                );

        log.info(
                "Doctor appointments fetched. doctorId={}, totalElements={}",
                doctorId,
                appointments.getTotalElements()
        );

        return appointments.map(this::mapToResponseDTO);
    }

    public AppointmentResponseDTO updateStatus(
            Long id,
            String newStatus) {

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new AppointmentNotFoundException(
                                        "Appointment not found with ID: " + id
                                )
                        );
        
        log.info(
                "Appointment status change requested. appointmentId={}, currentStatus={}, requestedStatus={}",
                id,
                appointment.getStatus(),
                newStatus
        );

        if (newStatus == null || newStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Appointment status is required"
            );
        }

        appointment.setStatus(
                Appointment.Status.valueOf(
                        newStatus.toUpperCase()
                )
        );

        Appointment updated =
                appointmentRepository.save(appointment);

        log.info(
                "Appointment status updated. appointmentId={}, status={}",
                updated.getId(),
                updated.getStatus()
        );

        return mapToResponseDTO(updated);
    }

    public List<AppointmentResponseDTO> getByDoctorAndRange(
            Long doctorId,
            LocalDateTime start,
            LocalDateTime end) {

        return appointmentRepository
                .findByDoctorIdAndDateTimeBetween(
                        doctorId,
                        start,
                        end
                )
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public Page<AppointmentResponseDTO> getAllPaged(
            Pageable pageable,
            String status,
            Long patientId,
            Long doctorId) {

        log.debug(
                "Fetching appointments. page={}, size={}, sort={}, status={}, patientId={}, doctorId={}",
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSort(),
                status,
                patientId,
                doctorId
        );

        Page<Appointment> appointments;

        if (status != null && !status.trim().isEmpty()) {

            Appointment.Status appointmentStatus;

            try {

                appointmentStatus =
                        Appointment.Status.valueOf(
                                status.trim().toUpperCase()
                        );

            } catch (IllegalArgumentException ex) {

                throw new IllegalArgumentException(
                        "Invalid appointment status: " + status
                );
            }

            if (patientId != null) {

                appointments =
                        appointmentRepository
                                .findByPatientIdAndStatus(
                                        patientId,
                                        appointmentStatus,
                                        pageable
                                );

            } else if (doctorId != null) {

                appointments =
                        appointmentRepository
                                .findByDoctorIdAndStatus(
                                        doctorId,
                                        appointmentStatus,
                                        pageable
                                );

            } else {

                appointments =
                        appointmentRepository.findByStatus(
                                appointmentStatus,
                                pageable
                        );
            }

        } else if (patientId != null) {

            appointments =
                    appointmentRepository.findByPatientId(
                            patientId,
                            pageable
                    );

        } else if (doctorId != null) {

            appointments =
                    appointmentRepository.findByDoctorId(
                            doctorId,
                            pageable
                    );

        } else {

            appointments =
                    appointmentRepository.findAll(pageable);
        }

        log.info(
                "Appointments fetched successfully. results={}, totalElements={}",
                appointments.getNumberOfElements(),
                appointments.getTotalElements()
        );

        return appointments.map(
                this::mapToResponseDTO
        );
    }

    public List<String> getAvailableSlots(
            Long doctorId,
            String date) {

        LocalDate selectedDate =
                LocalDate.parse(date);

        DayOfWeek day =
                selectedDate.getDayOfWeek();

        DoctorDTO doctor =
                doctorClient.getDoctorById(doctorId);

        if (doctor == null ||
                doctor.getAvailability() == null) {

            return List.of();
        }

        String dayName =
                day.toString().substring(0, 1)
                        + day.toString()
                        .substring(1)
                        .toLowerCase();

        String matched =
                doctor.getAvailability()
                        .stream()
                        .filter(a ->
                                a.startsWith(dayName)
                        )
                        .findFirst()
                        .orElse(null);

        if (matched == null) {
            return List.of();
        }

        String[] dayAndTime =
                matched.split(" ");

        if (dayAndTime.length < 2) {
            return List.of();
        }

        String[] timeRange =
                dayAndTime[1].split("-");

        if (timeRange.length < 2) {
            return List.of();
        }

        LocalTime start =
                LocalTime.parse(timeRange[0]);

        LocalTime end =
                LocalTime.parse(timeRange[1]);

        int slotMinutes = 30;

        LocalDateTime startDt =
                selectedDate.atStartOfDay();

        LocalDateTime endDt =
                selectedDate.atTime(23, 59);

        List<Appointment> booked =
                appointmentRepository
                        .findByDoctorIdAndDateTimeBetween(
                                doctorId,
                                startDt,
                                endDt
                        );

        Set<LocalTime> bookedTimes =
                booked.stream()
                        .map(a ->
                                a.getDateTime()
                                        .toLocalTime()
                        )
                        .collect(Collectors.toSet());

        List<String> slots =
                new ArrayList<>();

        while (start.isBefore(end)) {

            if (!bookedTimes.contains(start)) {
                slots.add(start.toString());
            }

            start =
                    start.plusMinutes(slotMinutes);
        }

        return slots;
    }

    private AppointmentResponseDTO mapToResponseDTO(
            Appointment appointment) {

        AppointmentResponseDTO response =
                new AppointmentResponseDTO();

        response.setId(appointment.getId());

        response.setPatientId(
                appointment.getPatientId()
        );

        response.setDoctorId(
                appointment.getDoctorId()
        );

        response.setDateTime(
                appointment.getDateTime()
        );

        response.setStatus(
                appointment.getStatus()
        );

        return response;
    }
}