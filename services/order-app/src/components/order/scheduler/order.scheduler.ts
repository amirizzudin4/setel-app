import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from '../v1/order.service';

@Injectable()
export class OrderScheduler {
  constructor(private service: OrderService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleDeliverOrder() {
    console.log('Running deliver all confirmed job');
    await this.service.deliverAllConfirmedOrderEvent();
  }
}
