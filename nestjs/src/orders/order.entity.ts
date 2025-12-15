import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../common/base-time.entity';

@Entity({ name: 'orders_nest' })
export class OrderEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'product_name', nullable: false })
  productName!: string;

  @Column({ type: 'integer', nullable: false })
  quantity!: number;

  @Column({ type: 'bigint', nullable: false })
  price!: number;

  constructor(partial?: Partial<OrderEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
  // nestjs 관례에 맞게 springboot랑 차이 둠
  // entity 인스턴스는 생성자보다 orm에 의존함 (repository.create())
}
