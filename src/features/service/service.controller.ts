import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';
import { ServiceService } from './use-case/service.service';
import { CreateServiceDto } from './core/dto/create-service.dto';
import { UpdateServiceDto } from './core/dto/update-service.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Crear servicio', description: 'Dado un clientId, descripcion, direccion y fecha de servicio, se podra crear un servicio.' })
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar servicios', description: 'Listado de todos los servicios.' })
  async findAll() {
    return this.serviceService.findAll();
  }

  @Get(':serviceId')
  @ApiOperation({ summary: 'Listar servicio', description: 'Dado un serviceId, se podra listar un servicio.' })
  async findOne(@Param('serviceId') serviceId: string) {
    return this.serviceService.findOne(serviceId);
  }

  @Get('/technician/:technicianId')
  @ApiOperation({ summary: 'Listar servicios de un tecnico', description: 'Dado un technicianId, se podra listar todos sus servicios.' })
  async findAllBytechnician(@Param('technicianId') technicianId: string) {
    return this.serviceService.findAllBytechnician(technicianId);
  }

  @Put(':serviceId')
  @ApiOperation({ summary: 'Actualizar servicio', description: 'Dado una descripcion, direccion y fecha de servicio, se podra actualizar un servicio.' })
  async update(@Param('serviceId') serviceId: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(serviceId, updateServiceDto);
  }

  @Patch(':serviceId')
  @ApiOperation({ summary: 'Finalizar servicio', description: 'Dado un serviceId, se podra finalizar un servicio.' })
  async finalize(@Param('serviceId') serviceId: string) {
    return this.serviceService.finalize(serviceId);
  }

  @Delete(':serviceId')
  @ApiOperation({ summary: 'Eliminar servicio', description: 'Dado un serviceId, se podra eliminar un servicio.' })
  async remove(@Param('serviceId') serviceId: string) {
    return this.serviceService.remove(serviceId);
  }
}
