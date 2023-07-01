import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TechnicianService } from './use-case/technician.service';
import { CreateTechnicianDto } from './core/dto/create-technician.dto';
import { UpdateTechnicianDto } from './core/dto/update-technician.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('technician')
@Controller('technician')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @Post()
  async create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return await this.technicianService.create(createTechnicianDto);
  }

  @Get()
  async findAll() {
    return await this.technicianService.findAll();
  }

  @Get(':technicianId')
  async findOne(@Param('technicianId') technicianId: string) {
    return await this.technicianService.findOne(technicianId);
  }

  @Put(':technicianId')
  async update(@Param('technicianId') technicianId: string, @Body() updateTechnicianDto: UpdateTechnicianDto) {
    return await this.technicianService.update(technicianId, updateTechnicianDto);
  }

  @Delete(':technicianId')
  async remove(@Param('technicianId') technicianId: string) {
    return await this.technicianService.remove(technicianId);
  }
}
