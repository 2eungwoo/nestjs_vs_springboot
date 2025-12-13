import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async createOrders(payloads: CreateOrderDto[]): Promise<OrderResponseDto[]> {
    const entities = payloads.map(
      (payload) =>
        new OrderEntity({
          productName: payload.productName,
          quantity: payload.quantity,
          price: payload.price,
        }),
    );
    const saved = await this.orderRepository.save(entities);
    return saved.map((entity) => new OrderResponseDto(entity));
  }
}
