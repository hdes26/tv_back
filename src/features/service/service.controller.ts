import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';
import { ServiceService } from './use-case/service.service';
import { CreateServiceDto } from './core/dto/create-service.dto';
import { UpdateServiceDto } from './core/dto/update-service.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.serviceService.create(createServiceDto);
  }

  @Get()
  async findAll() {
    return this.serviceService.findAll();
  }

  @Get(':serviceId')
  async findOne(@Param('serviceId') serviceId: string) {
    return this.serviceService.findOne(serviceId);
  }

  @Put(':serviceId')
  async update(@Param('serviceId') serviceId: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(serviceId, updateServiceDto);
  }

  @Patch(':serviceId')
  async finalize(@Param('serviceId') serviceId: string) {
    return this.serviceService.finalize(serviceId);
  }

  @Delete(':serviceId')
  async remove(@Param('serviceId') serviceId: string) {
    return this.serviceService.remove(serviceId);
  }
}
