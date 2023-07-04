import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { TechnicianService } from './use-case/technician.service';
import { CreateTechnicianDto } from './core/dto/create-technician.dto';
import { UpdateTechnicianDto } from './core/dto/update-technician.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from './../../../tv_common/utils/guards/jwt/accessToken.guard';
import { Roles, RolesGuard }  from './../../../tv_common/utils/guards/roles';
import { RoleNameEnum }  from './../../../tv_common/database/core/enums';

@ApiTags('technician')
@Controller('technician')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @Post()
  @ApiOperation({ summary: 'Crear tecnico', description: 'Dado un email, nombre y contraseña, se podra crear un tecnico.' })
  async create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return await this.technicianService.create(createTechnicianDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tecnicos', description: 'Listado de todos los tecnicos.' })
  async findAll() {
    return await this.technicianService.findAll();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleNameEnum.TECHNICIAN)
  @Get(':technicianId')
  @ApiOperation({ summary: 'Listar tecnico', description: 'Dado un clientId, se podra lista un tecnico.' })
  async findOne(@Param('technicianId') technicianId: string) {
    return await this.technicianService.findOne(technicianId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleNameEnum.TECHNICIAN)
  @Put(':technicianId')
  @ApiOperation({ summary: 'Actualizar tecnico', description: 'Dado un email, nombre o contraseña, se podra actualizar un tecnico.' })
  async update(@Param('technicianId') technicianId: string, @Body() updateTechnicianDto: UpdateTechnicianDto) {
    return await this.technicianService.update(technicianId, updateTechnicianDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleNameEnum.TECHNICIAN)
  @Delete(':technicianId')
  @ApiOperation({ summary: 'Eliminar tecnico', description: 'Dado un clientId, se podra eliminar un tecnico.' })
  async remove(@Param('technicianId') technicianId: string) {
    return await this.technicianService.remove(technicianId);
  }
}
