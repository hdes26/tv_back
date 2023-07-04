import { Module } from '@nestjs/common';
import { ServiceService } from './use-case/service.service';
import { ServiceController } from './service.controller';
import { Client, Service, Technician } from 'tv_common/database/core/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Technician, Client, Service])
  ],
  controllers: [ServiceController],
  providers: [ServiceService]
})
export class ServiceModule {}
