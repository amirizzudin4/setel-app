import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../schema/order.schema';
import { Model } from 'mongoose';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderStatus } from '../schema/order-status';
import { PaymentService } from 'src/components/payment/v1/payment.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService
  ) {}

  async createOrder(data: OrderCreatedEvent) {
    await this.orderModel.create({
      _id: data.orderId,
      product: data.product,
      amount: data.amount,
      status: data.orderStatus
    });

    await this.paymentService.createPaymentFromOrder(data);
  }

  async cancelOrder(id: string) {
    await this.orderModel.findByIdAndUpdate(id, {
      status: OrderStatus.cancelled
    });

    await this.paymentService.cancelPaymentbyOrder(id);
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    await this.orderModel.findByIdAndUpdate(id, { status: status });
  }

  async deliverAllConfirmedOrder() {
    await this.orderModel
      .updateMany(
        { status: OrderStatus.confirmed },
        { status: OrderStatus.delivered }
      )
      .exec();
  }
}
