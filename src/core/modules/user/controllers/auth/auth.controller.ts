import { AuthService } from '@core/modules/user/services/auth/auth.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiBearerAuth()
  @Get('verify-account')
  async verifyAccount(@Query('payload') payload) {
    const decoded = await this.service.activateAccount(payload);
    return decoded ? 'Account activated' : 'Failed to activate the account';
  }
}
