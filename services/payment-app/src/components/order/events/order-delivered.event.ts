import { Data } from 'dataclass';
import { OrderStatus } from '../schema/order-status';

export class OrderDeliveredEvent extends Data {
  orderStatus: OrderStatus;
}
