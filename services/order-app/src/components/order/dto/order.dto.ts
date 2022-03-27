import { OrderPaymentStatus, OrderStatus } from '../schema/order-status';

export class OrderDto {
  _id?: String;
  product: string;
  status: OrderStatus;
  payment?: OrderPaymentStatus;
}
