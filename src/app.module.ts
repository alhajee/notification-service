import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './modules/mail/mail.module';
import { PushNotificationModule } from './modules/push-notification/push-notification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HTTP_MAX_REDIRECTS, HTTP_TIMEOUT } from './common/constants';
import { PushService } from './modules/push-notification/service/push.service';
import { FcmClient } from './common/clients/fcm';

@Module({
  imports: [
    MailModule,
    PushNotificationModule,
    ConfigModule.forRoot({
      cache: true, // cache env in memory
      envFilePath: ['docker.env', '.env'],
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get(HTTP_TIMEOUT) || 300,
        maxRedirects: configService.get(HTTP_MAX_REDIRECTS) || 3,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PushService, FcmClient],
})
export class AppModule {}
