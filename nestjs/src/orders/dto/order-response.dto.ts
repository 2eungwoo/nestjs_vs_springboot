import { OrderEntity } from '../order.entity';

export class OrderResponseDto {
  id!: number;
  productName!: string;
  quantity!: number;
  price!: number;

  constructor(entity: OrderEntity) {
    this.id = entity.id;
    this.productName = entity.productName;
    this.quantity = entity.quantity;
    this.price = entity.price;
  }
}
