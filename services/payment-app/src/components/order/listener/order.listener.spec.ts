import { Test, TestingModule } from '@nestjs/testing';
import { OrderCanceledEvent } from '../events/order-canceled.event';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderStatus } from '../schema/order-status';
import { OrderService } from '../v1/order.service';
import { OrderListener } from './order.listener';

describe('OrderListener', () => {
  let controller: OrderListener;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderListener],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
            cancelOrder: jest.fn(),
            deliverAllConfirmedOrder: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<OrderListener>(OrderListener);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleOrderCreatedEvent', () => {
    it('should handle order created event', async () => {
      await controller.handleOrderCreatedEvent(
        OrderCreatedEvent.create({
          orderId: '123',
          orderStatus: OrderStatus.created,
          product: 'vacuum',
          amount: 100
        })
      );

      expect(jest.spyOn(service, 'createOrder')).toBeCalledTimes(1);
    });
  });

  describe('handleOrderDeletedEvent', () => {
    it('should handle order cancel event', async () => {
      await controller.handleOrderDeletedEvent(
        OrderCanceledEvent.create({ orderId: '123' })
      );

      expect(jest.spyOn(service, 'cancelOrder')).toBeCalledTimes(1);
    });
  });

  describe('handleOrderDeliveredEvent', () => {
    it('should handle order delivered event', async () => {
      await controller.handleOrderDeliveredEvent();

      expect(jest.spyOn(service, 'deliverAllConfirmedOrder')).toBeCalledTimes(
        1
      );
    });
  });
});
