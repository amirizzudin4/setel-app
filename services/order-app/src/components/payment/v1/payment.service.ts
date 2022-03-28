import { Injectable } from '@nestjs/common';
import { OrderService } from '../../order/v1/order.service';
import { PaymentCreatedEvent } from '../events/payment-created.event';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';

@Injectable()
export class PaymentService {
  constructor(private orderService: OrderService) {}
  async updatePayment(data: PaymentUpdatedEvent) {
    await this.orderService.updatePaymentDataByOrderid(data);
  }

  async createPayment(data: PaymentCreatedEvent) {
    await this.orderService.createPaymentDataByOrderId(data);
  }
}
