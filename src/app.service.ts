import { Injectable, Logger } from '@nestjs/common';
import { NewTransactionEvent } from './common/events/new-transaction.event';
import { MailService } from './modules/mail/service/mail.service';
import { PushService } from './modules/push-notification/service/push.service';
import { ConfigService } from '@nestjs/config';
import {
  MAIL_FROM,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USER,
} from './common/constants';

@Injectable()
export class AppService {
  constructor(
    private readonly mailService: MailService,
    private readonly pushService: PushService,
    private readonly configService: ConfigService,
  ) {
    Logger.log(this.configService.getOrThrow(MAIL_HOST));
    Logger.log(configService.getOrThrow(MAIL_PORT));
    Logger.log(configService.getOrThrow(MAIL_USER));
    Logger.log(configService.getOrThrow(MAIL_PASSWORD));
    Logger.log(configService.get(MAIL_FROM));
  }

  getHello(): string {
    return 'Hello World!';
  }

  sendNewTransactionNotification(newTransactionEvent: NewTransactionEvent) {
    const { email, ...rest } = newTransactionEvent;

    this.mailService.sendNewTransactionEmail(email, rest);
    this.pushService.sendPushNotification(
      'dKF8PhtgTSmeJBrzwNtbjW:APA91bHJNFY8i_E9NnBzvGUdZEdDRELQ8uWMJKfXi1P-C8SLdyWl06XRdKhOaUIOpFLZundyFvOmKA_eej96D3KiRZZeAAxPngZ94WiCPl5iMbuZoxC6ZvDeKIO_nU1BtLFwe8em786j',
      newTransactionEvent,
    );
  }
}
