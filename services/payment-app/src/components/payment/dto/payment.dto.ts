import { Order } from 'src/components/order/schema/order.schema';
import { PaymentStatus } from '../schema/payment-status';

export class PaymentDto {
  _id?: string;
  order: Order;
  status: PaymentStatus;
  amount: number;
}
