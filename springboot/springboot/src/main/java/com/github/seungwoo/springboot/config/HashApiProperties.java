package com.github.seungwoo.springboot.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "hash.api")
public class HashApiProperties {

    // URL : /hash (fastapi)
    private final String url = "http://127.0.0.1:7000/hash";

    public String getUrl() {
        return url;
    }
}
