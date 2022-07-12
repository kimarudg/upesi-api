import {
  UserModule,
  DatabaseModule,
  EmailModule,
  LoggerModule,
} from './modules';
import { Module, Global } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { config } from '@app/config';
import { UserResolver } from '@core/modules/user/resolvers';
import { RoleResolver } from '@core/modules/user/resolvers/role.resolver';
import { AuthResolver } from '@core/modules/user/resolvers/auth.resolver';

const resolvers = [UserResolver, RoleResolver, AuthResolver];

@Global()
@Module({
  imports: [DatabaseModule, UserModule, EmailModule, LoggerModule.forRoot()],
  exports: [DatabaseModule, UserModule, EmailModule, ...resolvers],
  providers: [...resolvers],
})
export class CoreModule {}
