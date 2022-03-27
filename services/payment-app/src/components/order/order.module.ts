import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentModule } from '../payment/payment.module';
import { OrderListener } from './listener/order.listener';
import { Order, OrderSchema } from './schema/order.schema';
import { OrderService } from './v1/order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.REDIS
      }
    ]),
    PaymentModule
  ],
  controllers: [OrderListener],
  providers: [OrderService]
})
export class OrderModule {}
