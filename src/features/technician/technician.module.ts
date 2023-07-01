import { Module } from '@nestjs/common';
import { TechnicianService } from './use-case/technician.service';
import { TechnicianController } from './technician.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technician, User } from 'tv_common/database/core/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Technician, User])
  ],
  controllers: [TechnicianController],
  providers: [TechnicianService]
})
export class TechnicianModule {}
