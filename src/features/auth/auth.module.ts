import { Module } from '@nestjs/common';
import { AuthService } from './use-case/auth.service';
import { AuthController } from './auth.controller';
import { User } from 'tv_common/database/core/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
