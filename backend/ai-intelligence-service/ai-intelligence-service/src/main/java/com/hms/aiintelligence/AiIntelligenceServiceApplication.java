package com.hms.aiintelligence;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AiIntelligenceServiceApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                AiIntelligenceServiceApplication.class,
                args
        );
    }
}