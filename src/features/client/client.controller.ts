import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ClientService } from './use-case/client.service';
import { CreateClientDto } from './core/dto/create-client.dto';
import { UpdateClientDto } from './core/dto/update-client.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from './../../../tv_common/utils/guards/jwt/accessToken.guard';
import { Roles, RolesGuard }  from './../../../tv_common/utils/guards/roles';
import { RoleNameEnum }  from './../../../tv_common/database/core/enums';


@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Post()
  @ApiOperation({ summary: 'Crear cliente', description: 'Dado un email, nombre y contraseña, se podra crear un cliente.' })
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes', description: 'Listado de todos los clientes.' })
  async findAll() {
    return await this.clientService.findAll();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleNameEnum.CLIENT)
  @Get(':clientId')
  @ApiOperation({ summary: 'Listar cliente', description: 'Dado un clientId, se podra listar un cliente.' })
  async findOne(@Param('clientId') clientId: string) {
    return await this.clientService.findOne(clientId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleNameEnum.CLIENT)
  @Put(':clientId')
  @ApiOperation({ summary: 'Actualizar cliente', description: 'Dado un email, nombre o contraseña, se podra actualizar un cliente.' })
  async update(@Param('clientId') clientId: string, @Body() updateClientDto: UpdateClientDto) {
    return await this.clientService.update(clientId, updateClientDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleNameEnum.CLIENT)
  @Delete(':clientId')
  @ApiOperation({ summary: 'Eliminar cliente', description: 'Dado un clientId, se podra eliminar un cliente.' })
  async remove(@Param('clientId') clientId: string) {
    return await this.clientService.remove(clientId);
  }
}
