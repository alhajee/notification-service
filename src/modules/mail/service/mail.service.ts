import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CONTACT_EMAIL, SITE_URL } from '@/common/constants';

@Injectable()
export class MailService {
  private siteUrl: string;
  private contactEmail: string;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.siteUrl = configService.get(SITE_URL);
    this.contactEmail = configService.get(CONTACT_EMAIL);
  }

  async sendPasswordResetToken(to: string, context?: any) {
    await this.mailerService.sendMail({
      to,
      subject: 'Password Reset Request',
      template: './password-reset',
      context: {
        ...context,
        year: new Date().getFullYear(),
        website: this.siteUrl,
      },
    });
  }

  async sendNewTransactionEmail(to: string, context?: any) {
    await this.mailerService.sendMail({
      to,
      subject: 'Nigerian Startup Portal',
      template: './confirmation',
      context: {
        ...context,
        year: new Date().getFullYear(),
        website: this.siteUrl,
      },
    });
  }

  async sendConfirmationEmail(
    to: string,
    context?: any,
    type?: 'STARTUP' | 'OTHERS',
  ) {
    let template;

    switch (type) {
      case 'STARTUP':
        template = './confirmation-startups';
        break;
      case 'OTHERS':
      default:
        template = './confirmation-others';
    }

    await this.mailerService.sendMail({
      to,
      subject: 'Nigerian Startup Portal',
      template: template,
      context: {
        ...(context || {}),
        year: new Date().getFullYear(),
        website: this.siteUrl,
      },
    });
  }

  async sendNewsletterConfirmation(to: string, context?: any) {
    await this.mailerService.sendMail({
      to,
      subject: 'Nigerian Startup Portal',
      template: './subscribe-newsletter',
      context: {
        ...context,
        year: new Date().getFullYear(),
        website: this.siteUrl,
      },
    });
  }

  async submitContactUsEmail(
    name: string,
    email: string,
    subject: string,
    body: string,
  ) {
    await this.mailerService.sendMail({
      to: this.contactEmail,
      subject,
      template: './contact-us',
      replyTo: email,
      context: {
        name,
        body,
        year: new Date().getFullYear(),
        website: this.siteUrl,
      },
    });
  }
}
