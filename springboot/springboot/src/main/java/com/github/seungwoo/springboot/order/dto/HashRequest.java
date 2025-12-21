package com.github.seungwoo.springboot.order.dto;

public record HashRequest(
        String productName,
    Integer quantity,
    Long price
) {}
