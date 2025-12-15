import { deepEqual, instance, mock, when, verify } from 'ts-mockito';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import {OrderResponseDto} from "./dto/order-response.dto";

describe('OrderService', () => {
  let mockRepository: Repository<OrderEntity>;
  let service: OrderService;

  beforeEach(() => {
    mockRepository = mock<Repository<OrderEntity>>();
    service = new OrderService(instance(mockRepository));
  });

  const createEntity = (partial: Partial<OrderEntity>) =>
    new OrderEntity(partial);

  it('create_orders : 요청 한방에 여러개 만들고 리턴은 dto로 나오는지 테스트', async () => {
    // given
    const requestDto: CreateOrderDto[] = [
      { productName: 'A', quantity: 1, price: 1000 },
      { productName: 'B', quantity: 2, price: 2000 },
    ];
    const created: OrderEntity[] = requestDto.map((dto: CreateOrderDto) => createEntity(dto));
    const saved: OrderEntity[] = created.map((entity:OrderEntity, idx:number) => {
      entity.id = idx + 1;
      return entity;
    });

    // when
    when(mockRepository.create(deepEqual(requestDto))).thenReturn(created);
    when(mockRepository.save(created)).thenResolve(saved);

    const result:OrderResponseDto[] = await service.createOrders(requestDto);

    // then
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    verify(mockRepository.create(deepEqual(requestDto))).once();
    verify(mockRepository.save(created)).once();
  });

  it('find_all_orders : 페이징 없이 find all 테스트 ', async () => {
    // given
    const entities = [
      createEntity({ id: 1, productName: 'A', quantity: 1, price: 1000 }),
      createEntity({ id: 2, productName: 'B', quantity: 2, price: 2000 }),
    ];

    // when
    when(mockRepository.find()).thenResolve(entities);
    const result:OrderResponseDto[] = await service.findAllOrders();

    // then
    expect(result).toHaveLength(2);
    expect(result[0].productName).toBe('A');
    verify(mockRepository.find()).once();
  });

  it('find_all_orders : find all 페이징 테스트 ', async () => {
    // given
    const options = { skip: 0, take: 1 };
    const entities:OrderEntity[] = [createEntity({ id: 1, productName: 'A', quantity: 1, price: 1000 })];

    // when
    when(mockRepository.findAndCount(deepEqual(options))).thenResolve([entities, 10]);
    const result: {
      data: OrderResponseDto[],
      total: number
    } = await service.findAllPagingOrders(options);


    // then
    expect(result.total).toBe(10);
    expect(result.data).toHaveLength(1);
    verify(mockRepository.findAndCount(deepEqual(options))).once();
  });
});
