import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderCanceledEvent } from '../events/order-canceled.event';
import { OrderService } from '../v1/order.service';

@Controller()
export class OrderListener {
  constructor(private service: OrderService) {}

  @EventPattern(OrderCreatedEvent.name)
  handleOrderCreatedEvent(@Payload() data: OrderCreatedEvent) {
    console.log(`on - ${OrderCreatedEvent.name}`);

    this.service.createOrder(data);
  }

  @EventPattern(OrderCanceledEvent.name)
  handleOrderDeletedEvent(@Payload() data: OrderCanceledEvent) {
    console.log(`on - ${OrderCanceledEvent.name}`);

    this.service.cancelOrder(data.orderId);
  }
}
