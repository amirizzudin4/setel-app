import { Controller, Injectable } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RedisContext
} from '@nestjs/microservices';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderDeletedEvent } from '../events/order-deleted.event';
import { OrderService } from '../v1/order.service';

@Controller()
export class OrderListener {
  constructor(private service: OrderService) {}

  @EventPattern(OrderCreatedEvent.name)
  handleOrderCreatedEvent(@Payload() data: OrderCreatedEvent) {
    console.log(`on - ${OrderCreatedEvent.name}`);

    this.service.createOrder(data);
  }

  @EventPattern(OrderDeletedEvent.name)
  handleOrderDeletedEvent(@Payload() data: OrderDeletedEvent) {
    console.log(`on - ${OrderDeletedEvent.name}`);

    this.service.deleteOrder(data.orderId);
  }
}
