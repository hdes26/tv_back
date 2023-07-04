import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'tv_common/settings/logger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  LoggingInterceptor,
  ResponseInterceptor,
  TimeoutInterceptor,
} from 'tv_common/settings/interceptors';
import { ExceptionFiltering } from 'tv_common/settings/filter';
import { ValidationPipe } from '@nestjs/common';

import * as basicAuth from 'express-basic-auth';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const configService = new ConfigService();
  const logger = new LoggerService();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({ origin: '*' });
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  app.useGlobalFilters(new ExceptionFiltering(logger));
  app.useGlobalPipes(new ValidationPipe());


  const proyect = 'imaginamos_tv';
  app.setGlobalPrefix(`api/v1/${proyect}`);

  const username = configService.get<string>('SWAGGER_USER');
  const password = configService.get<string>('SWAGGER_PASS');

  app.use(
    `/api/v1/${proyect}/docs`,
    basicAuth({
      challenge: true,
      users: {
        [username]: password,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(`${proyect}`)
    .setDescription('API documentation')
    .setVersion('0.0.1')
    .addBasicAuth()
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/api/v1/${proyect}/docs`, app, document, {
    // explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = configService.get<number>('HTTP_SERVER_PORT');
  await app.listen(port, () => {
    logger.log('APP', `${proyect} is running on http://localhost:${port}`);
    logger.debug(
      'APP',
      `Swagger is running on http://localhost:${port}/api/v1/${proyect}/docs`,
    );
  });

}
bootstrap();