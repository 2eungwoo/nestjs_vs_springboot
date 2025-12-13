package com.github.seungwoo.springboot.order.dto;

public record CreateOrderRequest(
        String productName,
        Integer quantity,
        Long price
) {
}
