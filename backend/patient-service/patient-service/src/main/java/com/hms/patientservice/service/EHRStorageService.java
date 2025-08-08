package com.hms.patientservice.service;

import java.io.IOException;
import java.net.URL;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
@ConditionalOnProperty(name = "ehr.s3.enabled", havingValue = "true")
public class EHRStorageService {

	@Value("${aws.s3.bucket-name}")
    private String bucketName;

    private final S3Client s3Client;
    private final S3Presigner presigner;

    //@Autowired
    public EHRStorageService(S3Client s3Client, S3Presigner presigner) {
        this.s3Client = s3Client;
        this.presigner = presigner;
    }

    public String uploadFile(MultipartFile file, String patientId) throws IOException {
        String key = "ehr/" + patientId + "/" + file.getOriginalFilename();

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(
        	    putRequest,
        	    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
        	);

        return key;
    }

    public URL getPresignedUrl(String key) {
        GetObjectRequest getRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(
                builder -> builder.signatureDuration(Duration.ofMinutes(10))
                                   .getObjectRequest(getRequest));

        return presignedRequest.url();
    }   
}