import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { PaymentController } from './v1/payment.controller';
import { PaymentService } from './v1/payment.service';
import { PaymentListener } from './listener/payment.listener';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.REDIS
      }
    ]),
    forwardRef(() => OrderModule)
  ],
  controllers: [PaymentController, PaymentListener],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
