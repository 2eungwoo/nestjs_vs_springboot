package com.github.seungwoo.springboot.order;

import com.github.seungwoo.springboot.config.HashApiProperties;
import com.github.seungwoo.springboot.order.dto.CreateOrderRequest;
import com.github.seungwoo.springboot.order.dto.HashRequest;
import com.github.seungwoo.springboot.order.dto.HashResponse;
import com.github.seungwoo.springboot.order.dto.OrderResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;
    private final HashApiProperties hashApiProperties;

    @Transactional
    public List<OrderResponse> createOrders(List<CreateOrderRequest> requests) {
        List<OrderEntity> saved = orderRepository.saveAll(
            requests.stream()
                .map(request -> OrderEntity.of(
                    request.productName(),
                    request.quantity(),
                    request.price(),
                    generateHash(request)
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

    private String generateHash(CreateOrderRequest dto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HashRequest request = new HashRequest(dto.productName(), dto.quantity(), dto.price());
        HttpEntity<HashRequest> entity = new HttpEntity<>(request, headers);
        HashResponse response = restTemplate.postForObject(
            hashApiProperties.getUrl(),
            entity,
            HashResponse.class
        );
        if (response == null || response.hash() == null) {
            throw new IllegalStateException("Failed to fetch hash from API");
        }
        return response.hash();
    }
}
