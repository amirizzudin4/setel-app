import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderDto } from '../dto/order.dto';
import { ResponseDto } from '../dto/response.dto';
import { OrderService } from './order.service';

@ApiTags('Order')
@Controller({ path: 'order', version: '1' })
export class OrderController {
  constructor(private service: OrderService) {}

  @Get(':id')
  getOrderById(@Param('id') id: string): Promise<OrderDto> {
    return this.service.findById(id);
  }

  @Post()
  createOrder(@Body() createData: CreateOrderDto): Promise<ResponseDto> {
    return this.service.createOrderEvent(createData);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string): Promise<ResponseDto> {
    return this.service.deleteOrderEvent(id);
  }
}
