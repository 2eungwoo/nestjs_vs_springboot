package com.github.seungwoo.springboot.order;

import com.github.seungwoo.springboot.config.HashApiProperties;
import com.github.seungwoo.springboot.order.dto.HashRequest;
import com.github.seungwoo.springboot.order.dto.HashResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class HashApiClient {

    private final RestTemplate restTemplate;
    private final HashApiProperties properties;

    public HashApiClient(RestTemplate restTemplate, HashApiProperties properties) {
        this.restTemplate = restTemplate;
        this.properties = properties;
    }

    public String generateHash(HashRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<HashRequest> httpEntity = new HttpEntity<>(request, headers);
        HashResponse response = restTemplate.postForObject(
            properties.getUrl(),
            httpEntity,
            HashResponse.class
        );
        if (response == null || response.hash() == null) {
            throw new IllegalStateException("Failed to fetch hash from API");
        }
        return response.hash();
    }
}
