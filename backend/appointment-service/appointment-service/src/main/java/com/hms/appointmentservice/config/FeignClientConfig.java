package com.hms.appointmentservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.hms.appointmentservice.util.TokenProvider;

import feign.RequestInterceptor;

@Configuration
public class FeignClientConfig {

	@Autowired 
	TokenProvider tokenProvider;
	
    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            String token = tokenProvider.getTokenFromRequest();
            if (token != null) {
                requestTemplate.header("Authorization", token);
            }
        };
    }
}
