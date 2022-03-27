import { Data } from 'dataclass';
import { OrderStatus } from '../schema/order-status';

export class OrderCreatedEvent extends Data {
  orderId: string;
  orderStatus: OrderStatus;
  product: string;
}
