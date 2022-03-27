import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../schema/order-status';

export class CreateOrderDto {
  @ApiProperty({ required: true, example: 'vacuum' })
  product: string;
}
