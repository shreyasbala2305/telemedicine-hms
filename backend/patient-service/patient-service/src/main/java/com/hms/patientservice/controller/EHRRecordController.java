package com.hms.patientservice.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hms.patientservice.model.EHRRecord;
import com.hms.patientservice.model.Patient;
import com.hms.patientservice.repository.EHRRecordRepository;
import com.hms.patientservice.repository.PatientRepository;
import com.hms.patientservice.service.EHRStorageService;

@RestController
@RequestMapping("/records")
public class EHRRecordController {
    @Autowired private EHRStorageService ehrStorageService;
    @Autowired private EHRRecordRepository ehrRepo;
    @Autowired private PatientRepository patientRepo;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadEHR(@RequestParam MultipartFile file,
                                            @RequestParam Long patientId,
                                            @RequestParam(required = false) String notes) throws IOException {
        Patient patient = patientRepo.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));

        String fileUrl = ehrStorageService.uploadFile(file, patientId.toString());

        EHRRecord record = new EHRRecord();
        record.setPatientId(patient);
        record.setFileUrl(fileUrl);
        record.setNotes(notes);	
        record.setTimeStamp(LocalDateTime.now());

        ehrRepo.save(record);
        return ResponseEntity.ok("Uploaded");
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<List<EHRRecord>> getRecords(@PathVariable Long id) {
        return ResponseEntity.ok(ehrRepo.findByPatientId(id));
    }
}
