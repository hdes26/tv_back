import { Module } from '@nestjs/common';
import { ClientService } from './use-case/client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client, User } from 'tv_common/database/core/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, User])
  ],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule {}
