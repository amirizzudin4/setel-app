import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../v1/payment.service';
import { PaymentListener } from './payment.listener';

describe('PaymentListener', () => {
  let listener: PaymentListener;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentListener],
      providers: [{ provide: PaymentService, useValue: {} }]
    }).compile();

    listener = module.get<PaymentListener>(PaymentListener);
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });
});
