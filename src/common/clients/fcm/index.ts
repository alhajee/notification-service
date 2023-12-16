import {
  FCM_CLIENT_EMAIL,
  FCM_PRIVATE_KEY,
  FCM_PROJECT_ID,
} from '@/common/constants';
import { PushMessage } from '@/common/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as https from 'https';

@Injectable()
export class FcmClient {
  private readonly projectId: string;
  private readonly host = 'fcm.googleapis.com';
  private readonly path: string;
  private readonly messagingScope =
    'https://www.googleapis.com/auth/firebase.messaging';
  private readonly scopes = [this.messagingScope];

  constructor(private readonly configService: ConfigService) {
    this.projectId = this.configService.getOrThrow<string>(FCM_PROJECT_ID);
    this.path = `/v1/projects/${this.projectId}/messages:send`;

    Logger.log(this.path, 'path');
    Logger.log(
      this.configService.getOrThrow<string>(FCM_PROJECT_ID),
      'FCM_PROJECT_ID',
    );
    Logger.log(
      this.configService.getOrThrow<string>(FCM_CLIENT_EMAIL),
      'FCM_CLIENT_EMAIL',
    );
    Logger.log(
      this.configService.getOrThrow<string>(FCM_PRIVATE_KEY),
      'FCM_PRIVATE_KEY',
    );
  }

  private getAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const clientEmail =
        this.configService.getOrThrow<string>(FCM_CLIENT_EMAIL);
      const privateKey = this.configService.getOrThrow<string>(FCM_PRIVATE_KEY);

      const jwtClient = new google.auth.JWT(
        clientEmail,
        null,
        privateKey,
        this.scopes,
        null,
      );

      jwtClient.authorize((err, tokens) => {
        console.log(tokens);
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
  }

  async sendFcmMessage(pushMessage: PushMessage): Promise<void> {
    const commonMessage = this.buildPushMessage(pushMessage);

    return new Promise<void>((resolve, reject) => {
      this.getAccessToken().then((accessToken) => {
        const options = {
          hostname: this.host,
          path: this.path,
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        };

        const request = https.request(options, (resp) => {
          resp.setEncoding('utf8');
          resp.on('data', (data) => {
            console.log('Message sent to Firebase for delivery, response:');
            console.log(data);
          });
        });

        request.on('error', (err) => {
          console.log('Unable to send message to Firebase');
          console.log(err);
          reject(err);
        });

        request.write(JSON.stringify(commonMessage));
        request.end();
        resolve();
      });
    });
  }

  private buildPushMessage = ({
    token,
    topic,
    title,
    body,
    data,
  }: PushMessage) => {
    return {
      message: {
        token: token,
        notification: {
          title: title,
          body: body,
        },
        data: {},
      },
    };
  };
}
