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
import com.hms.appointmentservice.dto.DoctorDTO;
import com.hms.appointmentservice.dto.EmailNotificationDTO;
import com.hms.appointmentservice.dto.MessageNotificationDTO;
import com.hms.appointmentservice.dto.NotificationDTO;
import com.hms.appointmentservice.dto.PatientDTO;
import com.hms.appointmentservice.exception.ResourceNotFoundException;
import com.hms.appointmentservice.model.Appointment;
import com.hms.appointmentservice.repository.AppointmentRepository;

@Service
public class AppointmentService {
	
	@Autowired
	private AppointmentRepository appointmentRepository;
	
	@Autowired
	private PatientClient patientClient;
	
	@Autowired
	private DoctorClient doctorClient;
	
	@Autowired
	private NotificationClient notificationClient;
	
//	@Autowired
//    private RestTemplate restTemplate;
//
//    private final String PATIENT_SERVICE_BASE = "http://localhost:8082/patients/";
//    private final String DOCTOR_SERVICE_BASE = "http://localhost:8084/doctors/";
//    private final String NOTIFICATION_SERVICE_BASE = "http://localhost:8086/notify";

	
	public AppointmentDTO bookAppointment(AppointmentDTO dto) {
		
		Long patientId = dto.getPatientId();
		Long doctorId = dto.getDoctorId();
		LocalDateTime dateTime = dto.getDateTime();
		
		//Validate patient exists
		PatientDTO patient = patientClient.getPatientById(patientId);
		if(patient == null)
//			throw new RuntimeException("Patient not found.");
			throw new ResourceNotFoundException("Patient not found with ID: " + patient.getId());

		
		//Validate doctor exists
		DoctorDTO doctor = doctorClient.getDoctorById(doctorId);
		if(doctor == null)
			throw new RuntimeException("Doctor not found.");
		
		boolean conflict = appointmentRepository.existsByDoctorIdAndDateTime(doctorId, dateTime);
	    if (conflict) {
	        throw new RuntimeException("Slot already booked for this doctor at " + dateTime);
	    }
		
//		// Validate patient exists
//        try {
//            restTemplate.getForObject(PATIENT_SERVICE_BASE + dto.patientId, PatientDTO.class);
//        } catch (Exception e) {
//            throw new RuntimeException("Patient not found");
//        }
//
//        // Validate doctor exists
//        try {
//            restTemplate.getForObject(DOCTOR_SERVICE_BASE + dto.doctorId, DoctorDTO.class);
//        } catch (Exception e) {
//            throw new RuntimeException("Doctor not found");
//        }
		
		Appointment appointment = new Appointment();
		appointment.setPatientId(patientId);
		appointment.setDoctorId(doctorId);
		appointment.setDateTime(dateTime);
		appointment.setStatus(Appointment.Status.CONFIRMED); //CONFIRMED
		Appointment saved = appointmentRepository.save(appointment);
		
		EmailNotificationDTO email = new EmailNotificationDTO();
		email.setTo(patient.getEmail());
		email.setSubject("Invoice Generated");
		email.setBody("Your appointment with Dr. " + doctor.getName() + " is confirmed.");
		try {
			notificationClient.sendEmail(email);
		}catch(Exception e) {
			System.err.println("Failed to send notification "+ e.getMessage());
		}
		
		MessageNotificationDTO message = new MessageNotificationDTO();
		message.setPhoneNumber(patient.getContact());
		message.setMessage("Your appointment with Dr. " + doctor.getName() + " is confirmed.");
		try {
			notificationClient.sendMessage(message);
		}catch(Exception e) {
			System.err.println("Failed to send notification "+ e.getMessage());
		}
		
	
		NotificationDTO notify = new NotificationDTO();
	    notify.recipientId = dto.getPatientId();
	    notify.message = "Your appointment has been booked for " + dto.getDateTime();
	    notify.type = "EMAIL";

//	    try {
//	        restTemplate.postForEntity(NOTIFICATION_SERVICE_BASE, notify, Void.class);
//	    } catch (Exception e) {
//	        System.out.println("⚠️ Failed to send notification: " + e.getMessage());
//	    }

	    return mapToDTO(saved);
	}
	
	private AppointmentDTO mapToDTO(Appointment appointment) {
		AppointmentDTO dto = new AppointmentDTO();
	    dto.setId(appointment.getId());  
	    dto.setPatientId(appointment.getPatientId());
	    dto.setDoctorId(appointment.getDoctorId());
	    dto.setStatus(appointment.getStatus());
	    return dto;
	}

	public List<Appointment> getByPatient(Long patientId){
		return appointmentRepository.findByPatientId(patientId);
	}
	
	public List<Appointment> getByDoctor(Long doctorId){
		return appointmentRepository.findByDoctorId(doctorId);
	}
	
	public Appointment updateStatus(Long id, String newStatus) {
		Appointment appointment = appointmentRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Appointment not found"));
		appointment.setStatus(Appointment.Status.valueOf(newStatus.toUpperCase()));
		return appointmentRepository.save(appointment);
	}
	
	public List<Appointment> getByDoctorAndRange(Long doctorId, LocalDateTime start, LocalDateTime end) {
	    return appointmentRepository.findByDoctorIdAndDateTimeBetween(doctorId, start, end);
	}
	
	public Page<Appointment> getAllPaged(int page, int size) {
	    Pageable pageable = PageRequest.of(page, size);
	    return appointmentRepository.findAll(pageable);
	}
	
	public List<String> getAvailableSlots(Long doctorId, String date) {

	    LocalDate selectedDate = LocalDate.parse(date);
	    DayOfWeek day = selectedDate.getDayOfWeek();

	    DoctorDTO doctor = doctorClient.getDoctorById(doctorId);

	    if (doctor == null || doctor.getAvailability() == null) {
	        return List.of();
	    }

	    // 🔥 Convert MONDAY → Monday
	    String dayName = day.toString().substring(0, 1) +
	                     day.toString().substring(1).toLowerCase();

	    // 🔥 Find matching availability
	    String matched = doctor.getAvailability().stream()
	        .filter(a -> a.startsWith(dayName))
	        .findFirst()
	        .orElse(null);

	    if (matched == null) return List.of();

	    // 🔥 Example: "Monday 09:00-17:00"
	    String[] dayAndTime = matched.split(" ");

	    if (dayAndTime.length < 2) return List.of();

	    String[] timeRange = dayAndTime[1].split("-");

	    if (timeRange.length < 2) return List.of();

	    LocalTime start = LocalTime.parse(timeRange[0]); // 09:00
	    LocalTime end = LocalTime.parse(timeRange[1]);   // 17:00

	    int slotMinutes = 30;

	    // 🔥 Fetch booked slots
	    LocalDateTime startDt = selectedDate.atStartOfDay();
	    LocalDateTime endDt = selectedDate.atTime(23, 59);

	    List<Appointment> booked = appointmentRepository
	        .findByDoctorIdAndDateTimeBetween(doctorId, startDt, endDt);

	    Set<LocalTime> bookedTimes = booked.stream()
	        .map(a -> a.getDateTime().toLocalTime())
	        .collect(Collectors.toSet());

	    List<String> slots = new ArrayList<>();

	    // 🔥 Generate slots
	    while (start.isBefore(end)) {

	        if (!bookedTimes.contains(start)) {
	            slots.add(start.toString());
	        }

	        start = start.plusMinutes(slotMinutes);
	    }

	    return slots;
	}

}
