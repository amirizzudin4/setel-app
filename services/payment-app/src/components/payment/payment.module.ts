import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { PaymentController } from './v1/payment.controller';
import { PaymentService } from './v1/payment.service';
import { PaymentListener } from './listener/payment.listener';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.REDIS
      }
    ])
  ],
  controllers: [PaymentController, PaymentListener],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
