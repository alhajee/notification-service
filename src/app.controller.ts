import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { NEW_TRANSACTION } from './common/constants';
import { NewTransactionEvent } from './common/events/new-transaction.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern(NEW_TRANSACTION)
  async handleNewTransaction(data: NewTransactionEvent) {
    await this.appService.sendNewTransactionNotification(data);
  }
}
