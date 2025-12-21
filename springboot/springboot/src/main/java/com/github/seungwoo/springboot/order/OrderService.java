package com.github.seungwoo.springboot.order;

import com.github.seungwoo.springboot.order.dto.CreateOrderRequest;
import com.github.seungwoo.springboot.order.dto.HashRequest;
import com.github.seungwoo.springboot.order.dto.OrderResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final HashApiClient hashApiClient;

    @Transactional
    public List<OrderResponse> createOrders(List<CreateOrderRequest> requests) {
        List<OrderEntity> saved = orderRepository.saveAll(
            requests.stream()
                .map(request -> OrderEntity.of(
                    request.productName(),
                    request.quantity(),
                    request.price(),
                    hashApiClient.generateHash(
                        new HashRequest(request.productName(), request.quantity(), request.price())
                    )
                ))
                .toList()
        );
        return saved.stream().map(OrderResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAllOrders() {
        return orderRepository.findAll().stream()
            .map(OrderResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> findAllPagingOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
            .map(OrderResponse::from);
    }
}
