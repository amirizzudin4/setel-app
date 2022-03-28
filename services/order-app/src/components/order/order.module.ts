import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderListener } from './listener/order.listener';
import { OrderScheduler } from './scheduler/order.scheduler';
import { Order, OrderSchema } from './schema/order.schema';
import { OrderController } from './v1/order.controller';
import { OrderService } from './v1/order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL,
          retryAttempts: 20,
          retryDelay: 3000
        }
      }
    ])
  ],
  controllers: [OrderController, OrderListener],
  providers: [OrderService, OrderScheduler],
  exports: [OrderService]
})
export class OrderModule {}
