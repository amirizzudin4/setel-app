import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../order/v1/order.service';
import { Payment } from '../schema/payment.schema';
import { PaymentService } from './payment.service';
import { Model } from 'mongoose';
import { OrderCreatedEvent } from '../../order/events/order-created.event';
import { PaymentCreatedEvent } from '../events/payment-created.event';
import { PaymentStatus } from '../schema/payment-status';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';
import { ResponseStatus } from '../dto/response.dto';

describe('PaymentService', () => {
  let service: PaymentService;
  let model: Model<Payment>;
  let client: 'PAYMENT_SERVICE';
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getModelToken(Payment.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findOneAndUpdate: jest.fn()
          }
        },
        { provide: 'PAYMENT_SERVICE', useValue: { emit: jest.fn() } },
        { provide: OrderService, useValue: { updateOrderStatus: jest.fn() } }
      ]
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    model = module.get<Model<Payment>>(getModelToken(Payment.name));
    client = module.get<'PAYMENT_SERVICE'>('PAYMENT_SERVICE');
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByOrderId', () => {
    it('should find by id', async () => {
      await service.findByOrderId('123');

      expect(jest.spyOn(model, 'findOne')).toBeCalledTimes(1);
    });
  });

  describe('createPaymentFromOrder', () => {
    it('should create payment from order event', async () => {
      const idSpy = jest
        .spyOn(service, 'checkIfIdAlreadyExisted')
        .mockResolvedValueOnce(true)
        .mockResolvedValue(false);

      await service.createPaymentFromOrder(OrderCreatedEvent.create({}));
      expect(idSpy).toBeCalledTimes(2);
      expect(jest.spyOn(client, 'emit')).toBeCalledTimes(1);
    });
  });

  describe('createPayment', () => {
    it('should create payment to DB', async () => {
      await service.createPayment(
        PaymentCreatedEvent.create({
          orderId: '123',
          paymentId: 'pay123',
          paymentStatus: PaymentStatus.pending,
          amount: 100
        })
      );

      expect(jest.spyOn(model, 'create')).toBeCalledTimes(1);
    });
  });

  describe('cancelPaymentbyOrder', () => {
    it('should emit event update to cancel order payment', async () => {
      await service.cancelPaymentbyOrder('123');

      expect(jest.spyOn(client, 'emit')).toBeCalledTimes(1);
    });
  });

  describe('updatePayment', () => {
    it('should update payment data', async () => {
      await service.updatePayment(
        PaymentUpdatedEvent.create({
          orderId: '123',
          paymentStatus: PaymentStatus.completed
        })
      );

      expect(jest.spyOn(model, 'findOneAndUpdate')).toBeCalledTimes(1);
      expect(jest.spyOn(orderService, 'updateOrderStatus')).toBeCalledTimes(1);
    });
  });

  describe('updateOrderPaymentEvent', () => {
    it('should update order payment event', async () => {
      const randomSpy = jest
        .spyOn(service, 'getRandomEnumValue')
        .mockReturnValue(PaymentStatus.completed);
      const res = await service.updateOrderPaymentEvent('123');

      expect(randomSpy).toBeCalledTimes(1);
      expect(jest.spyOn(client, 'emit')).toBeCalledTimes(1);
      expect(res.status).toBe(ResponseStatus.completed);
    });
  });

  describe('getRandomEnumValue', () => {
    it('should return enum value', (done) => {
      const res = service.getRandomEnumValue();

      expect(
        [
          PaymentStatus.completed,
          PaymentStatus.failed,
          PaymentStatus.cancelled
        ].includes(res)
      ).toBeTruthy();

      done();
    });
  });

  describe('checkIfIdAlreadyExisted', () => {
    it('should check if id already existed', async () => {
      const spy = jest.spyOn(model, 'findById').mockResolvedValue(null);

      const res = await service.checkIfIdAlreadyExisted('123');

      expect(spy).toBeCalledTimes(1);
      expect(res).toBeFalsy();
    });
  });
});
