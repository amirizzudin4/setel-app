import { OrderPaymentStatus, OrderStatus } from '../schema/order-status';

export class OrderDto {
  _id?: String;
  product: string;
  amount: number;
  status: OrderStatus;
  payment?: OrderPaymentStatus;
}
