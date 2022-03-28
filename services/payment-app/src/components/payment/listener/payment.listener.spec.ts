import { Test, TestingModule } from '@nestjs/testing';
import { PaymentCreatedEvent } from '../events/payment-created.event';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';
import { PaymentStatus } from '../schema/payment-status';
import { PaymentService } from '../v1/payment.service';
import { PaymentListener } from './payment.listener';

describe('PaymentListener', () => {
  let listener: PaymentListener;
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentListener],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            createPayment: jest.fn(),
            updatePayment: jest.fn()
          }
        }
      ]
    }).compile();

    listener = module.get<PaymentListener>(PaymentListener);
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('handlePaymentCreatedEvent', () => {
    it('should handle payment created event', async () => {
      await listener.handlePaymentCreatedEvent(
        PaymentCreatedEvent.create({
          orderId: '123',
          paymentId: 'pay123',
          paymentStatus: PaymentStatus.pending,
          amount: 100
        })
      );

      expect(jest.spyOn(service, 'createPayment')).toBeCalledTimes(1);
    });
  });

  describe('handlePaymentUpdatedEvent', () => {
    it('should handle payment updated event', async () => {
      await listener.handlePaymentUpdatedEvent(
        PaymentUpdatedEvent.create({
          orderId: '123',
          paymentStatus: PaymentStatus.completed
        })
      );

      expect(jest.spyOn(service, 'updatePayment')).toBeCalledTimes(1);
    });
  });
});
