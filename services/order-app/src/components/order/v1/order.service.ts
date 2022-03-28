import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ResponseDto, ResponseStatus } from '../dto/response.dto';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderCanceledEvent } from '../events/order-canceled.event';
import { OrderStatus } from '../schema/order-status';
import { Order, OrderDocument } from '../schema/order.schema';
import { PaymentCreatedEvent } from '../../payment/events/payment-created.event';
import { PaymentUpdatedEvent } from '../../payment/events/payment-updated.event';
import { PaymentStatus } from '../../payment/schema/payment-status';
import { OrderDeliveredEvent } from '../events/order-delivered.event';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @Inject('ORDER_SERVICE') private client: ClientProxy
  ) {}

  async findById(id: string): Promise<Order> {
    return this.orderModel.findById(id);
  }

  async createOrderEvent(createData: CreateOrderDto): Promise<ResponseDto> {
    let id: string;

    do {
      id = new Types.ObjectId().toString();
    } while (await this.checkIfIdAlreadyExisted(id));

    this.client.emit(
      OrderCreatedEvent.name,
      OrderCreatedEvent.create({
        orderId: id,
        product: createData.product,
        amount: createData.amount,
        orderStatus: OrderStatus.created
      })
    );

    return { id: id, status: ResponseStatus.create };
  }

  async createOrder(data: OrderCreatedEvent) {
    await this.orderModel.create({
      _id: data.orderId,
      product: data.product,
      amount: data.amount,
      status: data.orderStatus
    });
  }

  async cancelOrderEvent(id: string): Promise<ResponseDto> {
    this.client.emit(
      OrderCanceledEvent.name,
      OrderCanceledEvent.create({ orderId: id })
    );

    return { id: id, status: ResponseStatus.canceled };
  }

  async cancelOrder(id: string) {
    await this.orderModel.findByIdAndUpdate(id, {
      status: OrderStatus.cancelled
    });
  }

  async createPaymentDataByOrderId(data: PaymentCreatedEvent) {
    await this.orderModel.findByIdAndUpdate(data.orderId, {
      payment: {
        paymentId: data.paymentId,
        status: data.paymentStatus,
        amount: data.amount
      }
    });
  }

  async updatePaymentDataByOrderid(data: PaymentUpdatedEvent) {
    const orderStatus =
      data.paymentStatus === PaymentStatus.completed
        ? OrderStatus.confirmed
        : OrderStatus.cancelled;

    await this.orderModel.findByIdAndUpdate(data.orderId, {
      status: orderStatus,
      'payment.status': data.paymentStatus
    });
  }

  async deliverAllConfirmedOrderEvent() {
    this.client.emit(
      OrderDeliveredEvent.name,
      OrderDeliveredEvent.create({ orderStatus: OrderStatus.delivered })
    );
  }

  async deliverAllConfirmedOrder() {
    await this.orderModel
      .updateMany(
        { status: OrderStatus.confirmed },
        { status: OrderStatus.delivered }
      )
      .exec();
  }

  async checkIfIdAlreadyExisted(id: string): Promise<boolean> {
    const order = await this.orderModel.findById(id);
    return order !== null;
  }
}
