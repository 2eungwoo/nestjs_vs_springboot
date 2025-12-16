import { createHash } from 'crypto';
import { deepEqual, instance, mock, when, verify, anything } from 'ts-mockito';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderResponseDto } from './dto/order-response.dto';

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
    const entities: OrderEntity[] = requestDto.map((dto, idx) =>
        Object.assign(new OrderEntity(), {
          id: idx + 1,
          ...dto,
          hashId: 'hash-' + idx,
        }),
    );

    // when
    when(mockRepository.create(anything())).thenReturn(entities);
    when(mockRepository.save(entities)).thenResolve(entities);

    const result:OrderResponseDto[] = await service.createOrders(requestDto);

    // then
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[0].hashId).toBeDefined();
    verify(mockRepository.create(anything())).once();
    verify(mockRepository.save(entities)).once();
  });

  it('find_all_orders : 페이징 없이 find all 테스트 ', async () => {
    // given
    const entities = [
      createEntity({ id: 1, productName: 'A', quantity: 1, price: 1000, hashId: 'h1' }),
      createEntity({ id: 2, productName: 'B', quantity: 2, price: 2000, hashId: 'h2' }),
    ];

    // when
    when(mockRepository.find()).thenResolve(entities);
    const result:OrderResponseDto[] = await service.findAllOrders();

    // then
    expect(result).toHaveLength(2);
    expect(result[0].productName).toBe('A');
    expect(result[0].hashId).toBe('h1');
    verify(mockRepository.find()).once();
  });

  it('find_all_orders : find all 페이징 테스트 ', async () => {
    // given
    const options = { skip: 0, take: 1 };
    const entities:OrderEntity[] = [createEntity({ id: 1, productName: 'A', quantity: 1, price: 1000, hashId: 'h1' })];

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
