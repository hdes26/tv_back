import { Injectable } from '@nestjs/common';
import { CreateTechnicianDto } from '../core/dto/create-technician.dto';
import { UpdateTechnicianDto } from '../core/dto/update-technician.dto';
import { Technician, User } from './../../../../tv_common/database/core/entities/';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { encryptPassword } from './../../../../tv_common/utils/functions';
import { RoleNameEnum } from './../../../../tv_common/database/core/enums';

@Injectable()
export class TechnicianService {


  constructor(
    @InjectRepository(Technician)
    private technicianRepository: Repository<Technician>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createTechnicianDto: CreateTechnicianDto) {

    createTechnicianDto.password = encryptPassword(createTechnicianDto.password);

    const user = await this.userRepository.save({ role: RoleNameEnum.TECHNICIAN, ...createTechnicianDto });

    const newTechnician = await this.technicianRepository.save({ user });

    return newTechnician;
  }

  async findAll() {

    const technicians = await this.technicianRepository.find({ relations: ['user'] })

    return technicians;

  }

  async findOne(technicianId: string) {
    const technician = await this.technicianRepository.findOneOrFail({ relations: ['user'], where: { id: technicianId } })
    return technician;
  }

  async update(technicianId: string, updateTechnicianDto: UpdateTechnicianDto) {
    if (updateTechnicianDto.password) {
      updateTechnicianDto.password = encryptPassword(updateTechnicianDto.password);
    }
    const technician = await this.technicianRepository.findOneOrFail({ relations: ['user'], where: { id: technicianId } });

    return await this.userRepository.update(technician.user.id, updateTechnicianDto);;

  }

  async remove(technicianId: string) {
    const technician = await this.technicianRepository.findOneOrFail({ relations: ['user'], where: { id: technicianId } });

    await this.userRepository.update(technician.user.id, { deleted_at: new Date(), is_deleted: true });

    return await this.technicianRepository.update(technician.user.id, { deleted_at: new Date(), is_deleted: true });
  }
}
