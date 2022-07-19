import { AllExceptionFilter } from '@core/errors/all-exception.filter';
import { HttpExceptionInterceptor } from '@core/modules/logger/http-exception-interceptor.service';
import { LoggerService } from '@core/modules/logger/logger.service';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'typeorm';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useBodyParsers } from '@core/utils/functions';
import { config } from '@app/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });
  const logger: LoggerService = await app.resolve<LoggerService>(LoggerService);

  app.useGlobalInterceptors(new HttpExceptionInterceptor(logger));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());
  useBodyParsers(app);

  const corsOptions = {
    origin: config.cors.origin.push(/gadiness\.com$/),
    methods: config.cors.methods,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.enableCors(corsOptions);

  // API Docs
  const docOptions = new DocumentBuilder()
    .setTitle(config.app.title)
    .setDescription(config.app.description)
    .setVersion(config.api.version)
    .addBearerAuth()
    .build();
  const docs = SwaggerModule.createDocument(app, docOptions);
  SwaggerModule.setup('/api/docs', app, docs);
  const port = process.env.PORT || config.port;
  await app.listen(port);
  logger.info(`App is running on ${port}`);
}
bootstrap();
