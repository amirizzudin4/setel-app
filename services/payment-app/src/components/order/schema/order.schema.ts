import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderPaymentStatus, OrderStatus } from './order-status';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop()
  product: string;

  @Prop()
  amount: number;

  @Prop()
  status: OrderStatus;

  @Prop({ required: false })
  payment?: OrderPaymentStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
