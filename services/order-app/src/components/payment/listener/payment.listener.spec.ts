import { Test, TestingModule } from '@nestjs/testing';
import { PaymentListener } from './payment.listener';

describe('PaymentListener', () => {
  let controller: PaymentListener;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentListener]
    }).compile();

    controller = module.get<PaymentListener>(PaymentListener);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
