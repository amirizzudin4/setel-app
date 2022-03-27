import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { PaymentStatus } from './payment-status';
import { Order } from '../../order/schema/order.schema';

export type PaymentDocument = Payment & mongoose.Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    autopopulate: true,
    required: true,
    index: true
  })
  order: Order;

  @Prop()
  status: PaymentStatus;

  @Prop()
  amount: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
