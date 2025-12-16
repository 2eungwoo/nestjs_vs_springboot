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
    const dataWithHash = dto.map((dto) => ({
      ...dto,
      hashId: this.generateHash(dto),
    }));
    const insertResult = await this.orderRepository
      .createQueryBuilder()
      .insert()
      .into(OrderEntity)
      .values(dataWithHash)
      .returning(['id'])
      .execute();

    return dataWithHash.map((payload, index) => {
      const entity = new OrderEntity({
        id: insertResult.identifiers[index]?.id as number | undefined,
        ...payload,
      });
      return new OrderResponseDto(entity);
    });
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
