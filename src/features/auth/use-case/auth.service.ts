import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from '../core/dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'tv_common/database/core/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { comparePassword } from 'tv_common/utils/functions';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) { }

  private async getTokens(user: User) {
    // Get access token and refresh access token
    const payload = { id: user.id, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      //The access token duration is 12 hours
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_KEY'),
        expiresIn: '12h',
      }),
      //The access token refresh duration is 7 days
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_KEY'),
        expiresIn: '7d',
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async login({ email, password }: LoginDto) {
    // Login in webpage => ADMIN,OPERATOR,SUPPLIER,CLIENT
    const userFound = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password'],
    });
    if (!userFound || userFound.is_deleted === true || (userFound && comparePassword(password, userFound.password) === false)) {
      throw new BadRequestException('e-mail or password invalid');
    }
    return await this.getTokens(userFound);
  }
}
