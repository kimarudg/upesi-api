import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { ClassProvider, Module } from '@nestjs/common';
import { config } from '@config/index';

import { TYPES } from '@app/types';
import { MailController } from '@core/modules/email/controllers/mail/mail.controller';
import { MailService } from '@core/modules/email/services/mail/mail.service';

const mailServiceProvider: ClassProvider = {
  provide: TYPES.MailService,
  useClass: MailService,
};

const providers = [mailServiceProvider];

@Module({
  imports: [
    BullModule,
    MailerModule.forRoot({
      transport: {
        host: config.mail.host, //'smtp.office365.com',
        port: config.mail.port, //587,
        tls: {
          ciphers: config.mail.ciphers, // 'SSLv3',
        },
        secure: false, // true for 465, false for other ports
        auth: {
          user: config.mail.email, // generated ethereal user
          pass: config.mail.password, // generated ethereal password
        },
      },
      defaults: {
        from: config.mail.defaultFrom,
      },
      template: {
        dir: process.cwd() + '/template',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [...providers],
  exports: [BullModule, TYPES.MailService],
})
export class EmailModule {}
