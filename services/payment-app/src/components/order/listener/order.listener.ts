import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderCanceledEvent } from '../events/order-canceled.event';
import { OrderService } from '../v1/order.service';
import { OrderDeliveredEvent } from '../events/order-delivered.event';

@Controller()
export class OrderListener {
  constructor(private service: OrderService) {}

  @EventPattern(OrderCreatedEvent.name)
  async handleOrderCreatedEvent(@Payload() data: OrderCreatedEvent) {
    console.log(`on - ${OrderCreatedEvent.name}`);

    await this.service.createOrder(data);
  }

  @EventPattern(OrderCanceledEvent.name)
  async handleOrderDeletedEvent(@Payload() data: OrderCanceledEvent) {
    console.log(`on - ${OrderCanceledEvent.name}`);

    await this.service.cancelOrder(data.orderId);
  }

  @EventPattern(OrderDeliveredEvent.name)
  async handleOrderDeliveredEvent() {
    console.log(`on - ${OrderDeliveredEvent.name}`);

    await this.service.deliverAllConfirmedOrder();
  }
}
