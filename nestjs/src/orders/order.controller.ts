import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/orders')
  async createOrders(@Body() payloads: CreateOrderDto[]): Promise<OrderResponseDto[]> {
    return this.orderService.createOrders(payloads);
  }

  @Get('/orders/v1')
  async getOrders(): Promise<OrderResponseDto[]> {
    return this.orderService.findAllOrders();
  }

  @Get('/orders/v2')
  async getOrdersPaging(@Query('skip') skip?: number,
                        @Query('take') take?: number
  ): Promise<{ data: OrderResponseDto[]; total: number }> {
    const options = {
      skip: skip ?? 0,
      take: take ?? 10,
      order: { id: 'ASC' } as const,
    };
    return this.orderService.findAllPagingOrders(options);
  }
}
