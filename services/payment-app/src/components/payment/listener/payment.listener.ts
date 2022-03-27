import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentCreatedEvent } from '../events/payment-created.event';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';
import { PaymentService } from '../v1/payment.service';

@Controller()
export class PaymentListener {
  constructor(private service: PaymentService) {}

  @EventPattern(PaymentCreatedEvent.name)
  async handlePaymentCreatedEvent(@Payload() data: PaymentCreatedEvent) {
    console.log(`on - ${PaymentCreatedEvent.name}`);

    await this.service.createPayment(data);
  }

  @EventPattern(PaymentUpdatedEvent.name)
  async handlePaymentUpdatedEvent(@Payload() data: PaymentUpdatedEvent) {
    console.log(`on - ${PaymentUpdatedEvent.name}`);

    await this.service.updatePayment(data);
  }
}
