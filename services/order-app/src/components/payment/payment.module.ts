import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderModule } from '../order/order.module';
import { PaymentListener } from './listener/payment.listener';
import { PaymentService } from './v1/payment.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL,
          retryAttempts: 20,
          retryDelay: 3000
        }
      }
    ]),
    OrderModule
  ],
  controllers: [PaymentListener],
  providers: [PaymentService]
})
export class PaymentModule {}
