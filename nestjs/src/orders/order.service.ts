import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async createOrders(dto: CreateOrderDto[]): Promise<OrderResponseDto[]> {
    const dataWithHash = dto.map((payload) => ({
      ...payload,
      hashId: this.generateHash(payload),
    }));

    const entities = this.orderRepository.create(dataWithHash);
    const saved = await this.orderRepository.save(entities);

    return saved.map((entity) => new OrderResponseDto(entity));
  }

  async findAllOrders(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find();
    return orders.map((entity) => new OrderResponseDto(entity));
  }

  async findAllPagingOrders(options: FindManyOptions<OrderEntity>): Promise<{
    data: OrderResponseDto[];
    total: number;
  }> {
    const [orders, total] = await this.orderRepository.findAndCount(options);
    return {
      data: orders.map((entity) => new OrderResponseDto(entity)),
      total,
    };
  }

  private generateHash(dto: CreateOrderDto): string {
    const buffer = `${dto.productName}:${dto.quantity}:${dto.price}`;
    return createHash('sha256').update(buffer).digest('hex');
  }
}
