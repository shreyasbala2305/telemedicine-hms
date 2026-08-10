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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import com.hms.appointmentservice.exception.ResourceNotFoundException;
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

        // Validate patient exists
        PatientDTO patient =
                patientClient.getPatientById(patientId);

        if (patient == null) {
            throw new ResourceNotFoundException(
                    "Patient not found with ID: " + patientId
            );
        }

        // Validate doctor exists
        DoctorDTO doctor =
                doctorClient.getDoctorById(doctorId);

        if (doctor == null) {
            throw new ResourceNotFoundException(
                    "Doctor not found with ID: " + doctorId
            );
        }

        // Prevent double booking
        boolean conflict =
                appointmentRepository
                        .existsByDoctorIdAndDateTime(
                                doctorId,
                                dateTime
                        );

        if (conflict) {
            throw new RuntimeException(
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
         * NOTE:
         * Keeping the existing CONFIRMED behavior for this
         * standardization commit.
         *
         * Pending -> receptionist confirmation will be fixed
         * separately after S2-I2.
         */
        appointment.setStatus(
                Appointment.Status.CONFIRMED
        );

        Appointment saved =
                appointmentRepository.save(appointment);

        log.info(
                "Appointment created successfully. appointmentId={}, patientId={}, doctorId={}, dateTime={}",
                saved.getId(),
                saved.getPatientId(),
                saved.getDoctorId(),
                saved.getDateTime()
        );

        // Email notification
        EmailNotificationDTO email =
                new EmailNotificationDTO();

        email.setTo(patient.getEmail());
        email.setSubject("Appointment Booked");
        email.setBody(
                "Your appointment with Dr. "
                        + doctor.getName()
                        + " is confirmed."
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
                "Your appointment with Dr. "
                        + doctor.getName()
                        + " is confirmed."
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

    public List<AppointmentResponseDTO> getByPatient(
            Long patientId) {

        return appointmentRepository
                .findByPatientId(patientId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public List<AppointmentResponseDTO> getByDoctor(
            Long doctorId) {

        return appointmentRepository
                .findByDoctorId(doctorId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public AppointmentResponseDTO updateStatus(
            Long id,
            String newStatus) {

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );

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
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return appointmentRepository
                .findAll(pageable)
                .map(this::mapToResponseDTO);
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