import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { validationSchema } from 'tv_common/settings/validation';

import { JwtModule } from '@nestjs/jwt';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { BasicStrategy } from 'tv_common/utils/strategies/basic';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from 'tv_common/utils/strategies/jwt';
import { DatabaseModule } from 'tv_common/database/database.module';
import { ClientModule } from './features/client/client.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    {
      ...JwtModule.register({}),
      global: true,
    },
    DatabaseModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BasicStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule { }
