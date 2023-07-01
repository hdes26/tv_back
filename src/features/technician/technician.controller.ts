import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TechnicianService } from './use-case/technician.service';
import { CreateTechnicianDto } from './core/dto/create-technician.dto';
import { UpdateTechnicianDto } from './core/dto/update-technician.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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

  @Get(':technicianId')
  @ApiOperation({ summary: 'Listar tecnico', description: 'Dado un clientId, se podra lista un tecnico.' })
  async findOne(@Param('technicianId') technicianId: string) {
    return await this.technicianService.findOne(technicianId);
  }

  @Put(':technicianId')
  @ApiOperation({ summary: 'Actualizar tecnico', description: 'Dado un email, nombre o contraseña, se podra actualizar un tecnico.' })
  async update(@Param('technicianId') technicianId: string, @Body() updateTechnicianDto: UpdateTechnicianDto) {
    return await this.technicianService.update(technicianId, updateTechnicianDto);
  }

  @Delete(':technicianId')
  @ApiOperation({ summary: 'Eliminar tecnico', description: 'Dado un clientId, se podra eliminar un tecnico.' })
  async remove(@Param('technicianId') technicianId: string) {
    return await this.technicianService.remove(technicianId);
  }
}
