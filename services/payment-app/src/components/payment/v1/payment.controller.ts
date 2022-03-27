import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentDto } from '../dto/payment.dto';
import { ResponseDto } from '../dto/response.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller({ path: 'payment', version: '1' })
export class PaymentController {
  constructor(private service: PaymentService) {}

  @Get(':orderId')
  getOrderById(@Param('orderId') orderId: string): Promise<PaymentDto> {
    return this.service.findByOrderId(orderId);
  }

  @Put(':orderId/payment')
  updateOrderPaymentStatus(
    @Param('orderId') orderId: string
  ): Promise<ResponseDto> {
    return this.service.updateOrderPaymentEvent(orderId);
  }
}
