import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  public send(emailData: ISendMailOptions) {
    this.mailerService
      .sendMail(emailData)
      .then(success => {
        this.logger.debug(success);
      })
      .catch(error => {
        this.logger.error(error);
      });
  }
}
