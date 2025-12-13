package com.github.seungwoo.springboot.order.dto;

import com.github.seungwoo.springboot.order.OrderEntity;

public record OrderResponse(
        Long id,
        String productName,
        Integer quantity,
        Long price
) {
    public static OrderResponse from(OrderEntity entity) {
        return new OrderResponse(
            entity.getId(),
            entity.getProductName(),
            entity.getQuantity(),
            entity.getPrice()
        );
    }
}
