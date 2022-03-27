import { Test, TestingModule } from '@nestjs/testing';
import { OrderListener } from './order.listener';

describe('OrderListener', () => {
  let controller: OrderListener;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderListener]
    }).compile();

    controller = module.get<OrderListener>(OrderListener);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
