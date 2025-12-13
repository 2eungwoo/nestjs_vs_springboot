import { Body, Controller, Post } from '@nestjs/common';
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
}
