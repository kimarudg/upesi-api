import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '@app/core/decorators/permission.decorators';
import { TYPES } from '@app/types';
import { MailService } from '@core/modules/email/services/mail/mail.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('mail')
export class MailController {
  constructor(
    @Inject(TYPES.MailService) private readonly mailService: MailService,
  ) {}

  @Get('template-data')
  sendTemplateData(): any {
    return {
      status: 'oks',
    };
    // return this.mailService.send({
    //   to: 'kimarudg@gmail.com', // List of receivers email address
    //   from: '"David G"<davidkimaru@outlook.com>', // Senders email address
    //   subject: 'Dynamic Data',
    //   template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
    //   context: {
    //     // Data to be sent to template engine.
    //     code: 'cf1a3f828287',
    //     username: 'john doe',
    //   },
    // });
  }
}
