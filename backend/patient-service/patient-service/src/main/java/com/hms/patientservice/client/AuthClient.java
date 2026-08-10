package com.hms.patientservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hms.patientservice.dto.AuthApiResponse;
import com.hms.patientservice.dto.RegisterRequest;

@FeignClient(name = "auth-service")
public interface AuthClient {

    @PostMapping("/auth/register")
    AuthApiResponse register(@RequestBody RegisterRequest request);
}