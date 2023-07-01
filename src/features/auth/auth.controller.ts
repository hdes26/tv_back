import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './use-case/auth.service';
import { LoginDto } from './core/dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  @ApiOperation({ summary: 'Logearse para obtener tokens de acceso', description: 'Dado un email, y contraseña, se podra logear un usuario para obtener sus tokens de acceso.' })
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }
}
