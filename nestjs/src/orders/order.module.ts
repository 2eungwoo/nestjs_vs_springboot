import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { HashService } from './services/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), HttpModule],
  controllers: [OrderController],
  providers: [OrderService, HashService],
})
export class OrderModule {}
