import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ClientService } from './use-case/client.service';
import { CreateClientDto } from './core/dto/create-client.dto';
import { UpdateClientDto } from './core/dto/update-client.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientService.create(createClientDto);
  }

  @Get()
  async findAll() {
    return await this.clientService.findAll();
  }

  @Get(':clientId')
  async findOne(@Param('clientId') clientId: string) {
    return await this.clientService.findOne(clientId);
  }

  @Put(':clientId')
  async update(@Param('clientId') clientId: string, @Body() updateClientDto: UpdateClientDto) {
    return await this.clientService.update(clientId, updateClientDto);
  }

  @Delete(':clientId')
  async remove(@Param('clientId') clientId: string) {
    return await this.clientService.remove(clientId);
  }
}
