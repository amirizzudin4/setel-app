import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            findByOrderId: jest.fn(),
            updateOrderPaymentEvent: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrderById', () => {
    it('should get order by id', async () => {
      await controller.getOrderById('123');

      expect(jest.spyOn(service, 'findByOrderId')).toBeCalledTimes(1);
    });
  });

  describe('updateOrderPaymentStatus', () => {
    it('should update order status', async () => {
      await controller.updateOrderPaymentStatus('123');

      expect(jest.spyOn(service, 'updateOrderPaymentEvent')).toBeCalledTimes(1);
    });
  });
});
