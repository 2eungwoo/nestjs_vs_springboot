package com.github.seungwoo.springboot.order;

import com.github.seungwoo.springboot.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "orders_spring")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price", nullable = false)
    private Long price;

    @Column(name = "hash_id", nullable = false, length = 128)
    private String hashId;

    private OrderEntity(String productName, Integer quantity, Long price, String hashId) {
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
        this.hashId = hashId;
    }

    public static OrderEntity of(String productName, Integer quantity, Long price, String hashId) {
        return new OrderEntity(productName, quantity, price, hashId);
    }
}
