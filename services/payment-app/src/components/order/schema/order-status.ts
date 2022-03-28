export enum OrderStatus {
  created = 'created',
  confirmed = 'confirmed',
  delivered = 'delivered',
  cancelled = 'cancelled'
}

export enum PaymentStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
  cancelled = 'cancelled'
}

export class OrderPaymentStatus {
  paymentId: string;
  status: PaymentStatus;
}
