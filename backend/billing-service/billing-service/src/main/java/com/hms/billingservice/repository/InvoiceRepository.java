package com.hms.billingservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.billingservice.model.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long>{
    List<Invoice> findByPatientId(Long patientId);
}
