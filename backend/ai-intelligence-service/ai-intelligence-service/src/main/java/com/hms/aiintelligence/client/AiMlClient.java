package com.hms.aiintelligence.client;

import com.hms.aiintelligence.dto.AiMlPredictionRequestDTO;
import com.hms.aiintelligence.dto.AiMlPredictionResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
	    name = "ai-ml-service",
	    url = "${ai-ml-service.url}"
	)
public interface AiMlClient {

    @PostMapping("/predict")
    AiMlPredictionResponseDTO predict(
            @RequestBody AiMlPredictionRequestDTO request
    );
}