package com.hms.doctorservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hms.doctorservice.dto.AuthResponse;
import com.hms.doctorservice.dto.RegisterRequest;

@FeignClient(name = "auth-service")
public interface AuthClient {

    @PostMapping("/auth/register")
    AuthResponse register(@RequestBody RegisterRequest request);
}
