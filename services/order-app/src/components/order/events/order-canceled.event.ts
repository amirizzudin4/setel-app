import { Data } from 'dataclass';

export class OrderCanceledEvent extends Data {
  orderId: string;
}
