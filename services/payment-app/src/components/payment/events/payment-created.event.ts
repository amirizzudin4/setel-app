import { Data } from 'dataclass';
import { PaymentStatus } from '../schema/payment-status';

export class PaymentCreatedEvent extends Data {
  orderId: string;
  paymentId: string;
  paymentStatus: PaymentStatus;
  amount: number;
}
