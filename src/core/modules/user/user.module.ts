import { AuthResponse } from '@core/modules/user/responses/auth.response';
import { AuthService } from '@core/modules/user/services/auth/auth.service';
import { Global, Module } from '@nestjs/common';
import { ClassProvider } from '@nestjs/common/interfaces';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@config/index';
import { EmailModule } from '@core/modules/email/email.module';
import { TYPES } from '@app/types';
import { UserResolver } from '@core/modules/user/resolvers';
import { UserService } from '@core/modules/user/services/user/service';
import { SystemRoleService } from '@core/modules/user/services/system-roles/system-roles.service';

import { AppPermissionsService } from '@core/modules/user/services/app-permissions/app-permissions.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserPingInterceptor } from '@core/modules/user/interceptors';
import { JwtStrategy, LocalStrategy } from '@core/modules/user/strategies';
import { RoleResolver } from '@core/modules/user/resolvers/role.resolver';
import { AuthResolver } from '@core/modules/user/resolvers/auth.resolver';
import { AuthController } from '@core/modules/user/controllers/auth/auth.controller';
import { AuthorizationService } from './services/authorization/authorization.service';
import { AccessControl } from 'accesscontrol';
import { PassportModule } from '@nestjs/passport';

const userServiceProvider: ClassProvider = {
  provide: TYPES.UserService,
  useClass: UserService,
};

const authServiceProvider: ClassProvider = {
  provide: TYPES.AuthService,
  useClass: AuthService,
};

const resolvers = [UserResolver, RoleResolver, AuthResolver];
const services = [
  AuthService,
  JwtStrategy,
  LocalStrategy,
  AppPermissionsService,
  SystemRoleService,
  AuthorizationService,
  UserService,
];
const providers = [
  userServiceProvider,
  authServiceProvider,
  { provide: APP_INTERCEPTOR, useClass: UserPingInterceptor },
];

@Global()
@Module({
  imports: [
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn },
    }),
    AccessControl,
  ],
  providers: [...providers, ...resolvers, ...services],
  exports: [TYPES.UserService, TYPES.AuthService, ...services, ...resolvers],
  controllers: [AuthController],
})
export class UserModule {}
