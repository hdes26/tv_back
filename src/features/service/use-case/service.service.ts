import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateServiceDto } from '../core/dto/create-service.dto';
import { UpdateServiceDto } from '../core/dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client, Technician, Service } from './../../../../tv_common/database/core/entities/';
import { Repository } from 'typeorm';
import { ServiceStatusEnum, TechnicianStatusEnum } from './../../../../tv_common/database/core/enums/';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Technician)
    private technicianRepository: Repository<Technician>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) { }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  async create({ clientId, ...createServiceDto }: CreateServiceDto) {

    const clientFound = await this.clientRepository.findOneOrFail({ where: { id: clientId } });

    const techniciansFound = await this.technicianRepository.find({
      where: {
        status: TechnicianStatusEnum.AVAILABLE
      }
    });

    if (techniciansFound.length == 0) {
      throw new InternalServerErrorException('no technicians available');
    }
    const technicianRandom = this.getRandomInt(techniciansFound.length);
    const technicianFound = techniciansFound[technicianRandom];

    return await this.serviceRepository.save({ client: clientFound, technician: technicianFound, ...createServiceDto });

  }

  async findAll() {
    const services = await this.serviceRepository.find();
    return services;
  }

  async findOne(serviceId: string) {
    const service = await this.serviceRepository.findOneOrFail({ where: { id: serviceId } });
    return service;
  }

  async findAllBytechnician(technicianId: string) {

    const services = await this.serviceRepository.find({
      relations: ['technician'],
      where: {
        technician: {
          id: technicianId,
        },
      },
    });
    return services;
  }

  async update(serviceId: string, updateServiceDto: UpdateServiceDto) {
    return await this.serviceRepository.update(serviceId, updateServiceDto);
  }

  async finalize(serviceId: string) {
    return await this.serviceRepository.update(serviceId, { status: ServiceStatusEnum.FINALIZED });
  }

  async remove(serviceId: string) {    
    return await this.serviceRepository.update(serviceId, { deleted_at: new Date(), is_deleted: true });
  }
}
