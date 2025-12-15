package com.github.seungwoo.springboot.order;

import com.github.seungwoo.springboot.order.dto.CreateOrderRequest;
import com.github.seungwoo.springboot.order.dto.OrderResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders")
    public List<OrderResponse> createOrders(@RequestBody List<CreateOrderRequest> requests) {
        return orderService.createOrders(requests);
    }

    @GetMapping("/orders/v1")
    public List<OrderResponse> getOrders() {
        return orderService.findAllOrders();
    }

    @GetMapping("/orders/v2")
    public Page<OrderResponse> getOrders(Pageable pageable) {
        return orderService.findAllPagingOrders(pageable);
    }
}
