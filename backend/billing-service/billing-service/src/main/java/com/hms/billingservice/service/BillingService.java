package com.hms.billingservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.hms.billingservice.client.NotificationClient;
import com.hms.billingservice.client.PatientClient;
import com.hms.billingservice.dto.EmailNotificationDTO;
import com.hms.billingservice.dto.InvoiceDTO;
import com.hms.billingservice.dto.MessageNotificationDTO;
import com.hms.billingservice.dto.PatientDTO;
import com.hms.billingservice.model.Invoice;
import com.hms.billingservice.repository.InvoiceRepository;
import com.hms.billingservice.security.SecurityUtils;

@Service
public class BillingService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    private PatientClient patientClient;

    public Invoice generateInvoice(InvoiceDTO dto) {

        Long patientId = dto.getPatientId();
        double amount = dto.getAmount();

        PatientDTO patient =
                patientClient.getPatientById(patientId);

        if (patient == null) {
            throw new RuntimeException(
                    "Patient not found: " + patientId
            );
        }

        Invoice invoice = new Invoice();

        invoice.setPatientId(patientId);
        invoice.setAmount(amount);
        invoice.setStatus("PENDING");
        invoice.setGeneratedOn(LocalDateTime.now());

        invoiceRepository.save(invoice);

        EmailNotificationDTO email =
                new EmailNotificationDTO();

        email.setTo(patient.getEmail());
        email.setSubject("Invoice Generated");
        email.setBody(
                "An invoice of ₹"
                + amount
                + " has been generated for your visit."
        );

        notificationClient.sendEmail(email);

        MessageNotificationDTO message =
                new MessageNotificationDTO();

        message.setPhoneNumber(patient.getContact());
        message.setMessage(
                "Your invoice of ₹"
                + amount
                + " is generated. Please check your email."
        );

        notificationClient.sendMessage(message);

        return invoice;
    }

    public List<Invoice> getInvoiceByPatient(
            Long patientId) {

        authorizePatientAccess(patientId);

        return invoiceRepository.findByPatientId(patientId);
    }

    private void authorizePatientAccess(
            Long patientId) {

        String role =
                SecurityUtils.getCurrentRole();

        Long currentUserId =
                SecurityUtils.getCurrentUserId();

        // ADMIN and RECEPTIONIST can access billing
        // records for any patient.
        if ("ROLE_ADMIN".equals(role)
                || "ROLE_RECEPTIONIST".equals(role)) {
            return;
        }

        // PATIENT can access only their own records.
        if ("ROLE_PATIENT".equals(role)) {

            PatientDTO patient =
                    patientClient.getPatientById(patientId);

            if (patient == null) {
                throw new RuntimeException(
                        "Patient not found: " + patientId
                );
            }

            if (patient.getUserId() == null
                    || !patient.getUserId().equals(currentUserId)) {

                throw new AccessDeniedException(
                        "Patients can only access their own invoices"
                );
            }

            return;
        }

        throw new AccessDeniedException(
                "Access denied"
        );
    }
}