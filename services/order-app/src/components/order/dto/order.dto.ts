import { OrderPaymentStatus, OrderStatus } from '../schema/order-status';

export class OrderDto {
  _id?: string;
  product: string;
  amount: number;
  status: OrderStatus;
  payment?: OrderPaymentStatus;
}
