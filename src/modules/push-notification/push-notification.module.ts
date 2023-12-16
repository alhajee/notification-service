import { Module } from '@nestjs/common';
import { PushService } from './service/push.service';
import { FcmClient } from '@/common/clients/fcm';

@Module({
  imports: [],
  providers: [PushService, FcmClient],
})
export class PushNotificationModule {}
