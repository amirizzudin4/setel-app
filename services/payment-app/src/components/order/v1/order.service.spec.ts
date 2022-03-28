import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../../payment/v1/payment.service';
import { Order } from '../schema/order.schema';
import { OrderService } from './order.service';
import { Model } from 'mongoose';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderStatus } from '../schema/order-status';

describe('OrderService', () => {
  let service: OrderService;
  let model: Model<Order>;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            updateMany: jest.fn(),
            exec: jest.fn()
          }
        },
        {
          provide: PaymentService,
          useValue: {
            createPaymentFromOrder: jest.fn(),
            cancelPaymentbyOrder: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<OrderService>(OrderService);
    model = module.get<Model<Order>>(getModelToken(Order.name));
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create new model', async () => {
      await service.createOrder(
        OrderCreatedEvent.create({
          orderId: '123',
          orderStatus: OrderStatus.created,
          product: 'vacuum',
          amount: 100
        })
      );

      expect(jest.spyOn(model, 'create')).toBeCalledTimes(1);
      expect(
        jest.spyOn(paymentService, 'createPaymentFromOrder')
      ).toBeCalledTimes(1);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order', async () => {
      await service.cancelOrder('123');

      expect(jest.spyOn(model, 'findByIdAndUpdate')).toBeCalledTimes(1);
      expect(
        jest.spyOn(paymentService, 'cancelPaymentbyOrder')
      ).toBeCalledTimes(1);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      await service.updateOrderStatus('123', OrderStatus.confirmed);

      expect(jest.spyOn(model, 'findByIdAndUpdate')).toBeCalledTimes(1);
    });
  });

  describe('deliverAllConfirmedOrder', () => {
    it('should update all confirmed order to deliver', async () => {
      const spy = jest.spyOn(model, 'updateMany').mockReturnValue({
        exec: jest.fn()
      } as never);

      await service.deliverAllConfirmedOrder();

      expect(spy).toBeCalledTimes(1);
    });
  });
});
