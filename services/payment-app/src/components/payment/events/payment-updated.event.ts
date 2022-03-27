import { Data } from 'dataclass';
import { PaymentStatus } from '../schema/payment-status';

export class PaymentUpdatedEvent extends Data {
  orderId: string;
  paymentStatus: PaymentStatus;
}
