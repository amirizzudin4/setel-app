import { Data } from 'dataclass';

export class OrderDeletedEvent extends Data {
  orderId: string;
}
