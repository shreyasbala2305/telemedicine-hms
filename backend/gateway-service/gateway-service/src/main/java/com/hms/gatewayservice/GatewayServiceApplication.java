package com.hms.gatewayservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {
        org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
        org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class
})
public class GatewayServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                GatewayServiceApplication.class,
                args
        );
    }
}