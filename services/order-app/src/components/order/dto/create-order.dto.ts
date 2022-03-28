import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ required: true, example: 'vacuum' })
  product: string;

  @ApiProperty({ required: true, example: 100.0 })
  amount: number;
}
