package com.hms.billingservice.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.hms.billingservice.client.PatientClient;
import com.hms.billingservice.dto.InsuranceClaimDTO;
import com.hms.billingservice.dto.PatientDTO;
import com.hms.billingservice.model.InsuranceClaim;
import com.hms.billingservice.model.Invoice;
import com.hms.billingservice.repository.InsuranceClaimRepository;
import com.hms.billingservice.repository.InvoiceRepository;
import com.hms.billingservice.security.SecurityUtils;

@Service
public class InsuranceClaimService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InsuranceClaimRepository insuranceClaimRepository;

    @Autowired
    private PatientClient patientClient;

    public InsuranceClaim submitClaim(
            InsuranceClaimDTO dto) {

        Invoice invoice =
                invoiceRepository.findById(dto.getInvoiceId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"
                                ));

        // The invoice must belong to the patient
        // specified in the claim.
        if (!invoice.getPatientId().equals(dto.getPatientId())) {

            throw new AccessDeniedException(
                    "Invoice does not belong to the specified patient"
            );
        }

        authorizePatientAccess(dto.getPatientId());

        InsuranceClaim insuranceClaim =
                new InsuranceClaim();

        insuranceClaim.setPatientId(
                dto.getPatientId()
        );

        insuranceClaim.setInvoiceId(
                dto.getInvoiceId()
        );

        insuranceClaim.setInsurer(
                dto.getInsurer()
        );

        insuranceClaim.setClaimStatus(
                "SUBMITTED"
        );

        insuranceClaim.setSubmittedAt(
                LocalDateTime.now()
        );

        return insuranceClaimRepository.save(
                insuranceClaim
        );
    }

    private void authorizePatientAccess(
            Long patientId) {

        String role =
                SecurityUtils.getCurrentRole();

        Long currentUserId =
                SecurityUtils.getCurrentUserId();

        // ADMIN and RECEPTIONIST can submit claims
        // for any patient.
        if ("ROLE_ADMIN".equals(role)
                || "ROLE_RECEPTIONIST".equals(role)) {
            return;
        }

        // PATIENT can submit only for themselves.
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
                        "Patients can only submit claims for themselves"
                );
            }

            return;
        }

        throw new AccessDeniedException(
                "Access denied"
        );
    }
}