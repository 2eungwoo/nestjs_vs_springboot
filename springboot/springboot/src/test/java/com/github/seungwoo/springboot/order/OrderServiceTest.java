package com.github.seungwoo.springboot.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.github.seungwoo.springboot.order.dto.CreateOrderRequest;
import com.github.seungwoo.springboot.order.dto.HashResponse;
import com.github.seungwoo.springboot.order.dto.OrderResponse;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.client.RestTemplate;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @InjectMocks
    private OrderService orderService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private HashApiProperties hashApiProperties;

    private List<OrderEntity> storedOrders;

    @BeforeEach
    void setUp() {
        storedOrders = List.of(
            OrderEntity.of("product-1", 1, 100L, "hash-1"),
            OrderEntity.of("product-2", 2, 200L, "hash-2")
        );
    }

    @Test
    void create_orders_batch_insert() {
        // given
        List<CreateOrderRequest> requestDto = List.of(
            new CreateOrderRequest("product-1", 1, 100L),
            new CreateOrderRequest("product-2", 2, 200L)
        );
        given(hashApiProperties.getUrl()).willReturn("http://localhost:7000/hash");
        given(orderRepository.saveAll(anyList())).willReturn(storedOrders);
        given(restTemplate.postForObject(any(String.class), any(), any()))
            .willReturn(new HashResponse("hash-1"));

        // when
        List<OrderResponse> result = orderService.createOrders(requestDto);

        // then
        then(orderRepository).should().saveAll(anyList());
        assertThat(result).hasSize(2);
        assertThat(result.get(0).productName()).isEqualTo("product-1");
        assertThat(result.get(0).hashId()).isEqualTo("hash-1");
    }

    @Test
    void find_all_orders_without_paging() {
        // given
        given(orderRepository.findAll()).willReturn(storedOrders);

        // when
        List<OrderResponse> responses = orderService.findAllOrders();

        // then
        then(orderRepository).should().findAll();
        assertThat(responses).hasSize(2);
    }

    @Test
    void find_all_orders_with_paging() {
        // given
        PageRequest pageable = PageRequest.of(0, 2);
        given(orderRepository.findAll(pageable))
            .willReturn(new PageImpl<>(storedOrders, pageable, storedOrders.size()));

        // when
        Page<OrderResponse> page = orderService.findAllPagingOrders(pageable);

        // then
        then(orderRepository).should().findAll(pageable);
        assertThat(page.getTotalElements()).isEqualTo(2);
    }
}
