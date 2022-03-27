import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ResponseDto, ResponseStatus } from '../dto/response.dto';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderDeletedEvent } from '../events/order-deleted.event';
import { OrderStatus } from '../schema/order-status';
import { Order, OrderDocument } from '../schema/order.schema';

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
        orderStatus: OrderStatus.created
      })
    );

    return { status: ResponseStatus.create };
  }

  async createOrder(data: OrderCreatedEvent): Promise<Order> {
    return this.orderModel.create({
      _id: data.orderId,
      product: data.product,
      status: data.orderStatus
    });
  }

  async deleteOrderEvent(id: string): Promise<ResponseDto> {
    this.client.emit(
      OrderDeletedEvent.name,
      OrderDeletedEvent.create({ orderId: id })
    );

    return { status: ResponseStatus.deleted };
  }

  async deleteOrder(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id);
  }

  async checkIfIdAlreadyExisted(id: string): Promise<boolean> {
    let order = await this.orderModel.findById(id);
    return order !== null;
  }
}
