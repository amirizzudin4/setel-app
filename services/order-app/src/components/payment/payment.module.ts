import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { PaymentListener } from './listener/payment.listener';
import { PaymentService } from './v1/payment.service';

@Module({
  imports: [OrderModule],
  controllers: [PaymentListener],
  providers: [PaymentService]
})
export class PaymentModule {}
