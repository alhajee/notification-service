import { FcmClient } from '@/common/clients/fcm';
import { NewTransactionEvent } from '@/common/events/new-transaction.event';
import { PushMessage } from '@/common/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PushService {
  constructor(private readonly fcmClient: FcmClient) {}

  sendPushNotification(deviceId: string, data: NewTransactionEvent) {
    const msg: PushMessage = {
      token: deviceId,
      title: 'Transaction Notification',
      body: `Credit alert of ${data.fee}`,
      topic: 'test',
    };
    this.fcmClient.sendFcmMessage(msg);
  }
}
