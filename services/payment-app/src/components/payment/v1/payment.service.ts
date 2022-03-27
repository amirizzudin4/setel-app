import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from '../schema/payment.schema';
import { Model, Types } from 'mongoose';
import { OrderCreatedEvent } from 'src/components/order/events/order-created.event';
import { PaymentStatus } from '../schema/payment-status';
import { ResponseDto, ResponseStatus } from '../dto/response.dto';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';
import { PaymentCreatedEvent } from '../events/payment-created.event';
import { OrderService } from 'src/components/order/v1/order.service';
import { OrderStatus } from 'src/components/order/schema/order-status';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    @Inject('PAYMENT_SERVICE') private client: ClientProxy,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService
  ) {}

  async findByOrderId(orderId: string): Promise<Payment> {
    return this.paymentModel.findOne({ order: orderId });
  }

  async createPaymentFromOrder(data: OrderCreatedEvent) {
    let id: string;

    do {
      id = new Types.ObjectId().toString();
    } while (await this.checkIfIdAlreadyExisted(id));

    this.client.emit(
      PaymentCreatedEvent.name,
      PaymentCreatedEvent.create({
        orderId: data.orderId,
        paymentId: id,
        paymentStatus: PaymentStatus.pending,
        amount: data.amount
      })
    );
  }

  async createPayment(data: PaymentCreatedEvent) {
    await this.paymentModel.create({
      _id: data.paymentId,
      order: data.orderId,
      amount: data.amount,
      status: data.paymentStatus
    });
  }

  async cancelPaymentbyOrder(orderId: string) {
    this.client.emit(
      PaymentUpdatedEvent.name,
      PaymentUpdatedEvent.create({
        orderId: orderId,
        paymentStatus: PaymentStatus.cancelled
      })
    );
  }

  async updatePayment(data: PaymentUpdatedEvent) {
    await this.paymentModel.findOneAndUpdate(
      { order: data.orderId },
      { status: data.paymentStatus },
      { returnDocument: 'after' }
    );

    await this.orderService.updateOrderStatus(
      data.orderId,
      data.paymentStatus === PaymentStatus.completed
        ? OrderStatus.confirmed
        : OrderStatus.cancelled
    );
  }

  async updateOrderPaymentEvent(orderId: string): Promise<ResponseDto> {
    const paymentStatus = this.getRandomEnumValue();

    this.client.emit(
      PaymentUpdatedEvent.name,
      PaymentUpdatedEvent.create({
        orderId: orderId,
        paymentStatus: paymentStatus
      })
    );

    return {
      id: orderId,
      status:
        paymentStatus === PaymentStatus.completed
          ? ResponseStatus.completed
          : paymentStatus === PaymentStatus.failed
          ? ResponseStatus.failed
          : ResponseStatus.canceled
    };
  }

  getRandomEnumValue(): PaymentStatus {
    const enumValues = [
      PaymentStatus.completed,
      PaymentStatus.failed,
      PaymentStatus.cancelled
    ];

    const randomIndex = Math.floor(Math.random() * enumValues.length);
    const randomEnumKey = enumValues[randomIndex];
    return PaymentStatus[randomEnumKey];
  }

  async checkIfIdAlreadyExisted(id: string): Promise<boolean> {
    let order = await this.paymentModel.findById(id);
    return order !== null;
  }
}
