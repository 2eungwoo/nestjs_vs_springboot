package com.github.seungwoo.springboot.order;

import com.github.seungwoo.springboot.order.dto.CreateOrderRequest;
import com.github.seungwoo.springboot.order.dto.OrderResponse;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional
    public List<OrderResponse> createOrders(List<CreateOrderRequest> requests) {
        List<OrderEntity> entities = requests.stream()
                .map(request -> OrderEntity.of(
                    request.productName(),
                    request.quantity(),
                    request.price())
                )
                .collect(Collectors.toList());

        List<OrderEntity> saved = orderRepository.saveAll(entities);
        return saved.stream().map(OrderResponse::from).toList();
    }
}
