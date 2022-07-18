import { GqlAuthGuard } from './core/modules/user/guards/gql-auth.guard';
// import { UserModule } from '@core/modules/user/user.module';
import { config } from '@app/config';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { APP_GUARD } from '@nestjs/core';
import { BankAccountModule } from './bank-account/bank-account.module';

@Module({
  imports: [
    CoreModule,
    GraphQLModule.forRoot({
      debug: config.isDevelopment,
      playground: true,
      autoSchemaFile: './schema.gql',
      include: [CoreModule, BankAccountModule],
      context: ({ req }) => ({ req }),
      introspection: true,
    }),
    BankAccountModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    HelmetMiddleware.configure({
      dnsPrefetchControl: false,
      frameguard: true,
      hidePoweredBy: true,
    });
    consumer
      .apply(HelmetMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
