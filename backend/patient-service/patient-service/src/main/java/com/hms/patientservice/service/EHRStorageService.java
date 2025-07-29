package com.hms.patientservice.service;

import java.io.IOException;
import java.net.URL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import ch.qos.logback.core.util.Duration;

@Service
public class EHRStorageService {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Autowired
    private S3Client s3Client;

    public String uploadFile(MultipartFile file, String patientId) throws IOException {
        String key = "ehr/" + patientId + "/" + file.getOriginalFilename();

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl("private")
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return key;
    }

    public URL getPresignedUrl(String key) {
        S3Presigner presigner = S3Presigner.create();
        GetObjectRequest getRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        return presigner.presignGetObject(builder ->
                builder.signatureDuration(Duration.ofMinutes(10))
                        .getObjectRequest(getRequest)).url();
    }
}
