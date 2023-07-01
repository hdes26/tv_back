import { Injectable } from '@nestjs/common';
import { CreateTechnicianDto } from '../core/dto/create-technician.dto';
import { UpdateTechnicianDto } from '../core/dto/update-technician.dto';
import { Technician, User } from 'tv_common/database/core/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { encryptPassword } from 'tv_common/utils/functions';
import { RoleNameEnum } from 'tv_common/database/core/enums';

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
    const query = await this.technicianRepository.createQueryBuilder('technician')
      .leftJoinAndSelect('technician.user', 'user')
      .getRawMany()

    return query;
  }

  async findOne(technicianId: string) {
    const query = await this.technicianRepository.createQueryBuilder('technician')
      .leftJoinAndSelect('technician.user', 'user')
      .where('technician.id = :technicianId', { technicianId })
      .getRawOne()

    return query;
  }

  async update(technicianId: string, updateTechnicianDto: UpdateTechnicianDto) {
    if (updateTechnicianDto.password) {
      updateTechnicianDto.password = encryptPassword(updateTechnicianDto.password);
    }
    const technician = await this.technicianRepository.createQueryBuilder('technician')
      .leftJoinAndSelect('technician.user', 'user')
      .select('user')
      .where('technician.id = :technicianId', { technicianId })
      .getRawOne();

    return await this.userRepository.update(technician.user_id, updateTechnicianDto);

  }

  async remove(technicianId: string) {
    const technician = await this.technicianRepository.createQueryBuilder('technician')
      .leftJoinAndSelect('technician.user', 'user')
      .where('technician.id = :technicianId', { technicianId })
      .getRawOne();

    await this.userRepository.update(technician.user_id, { deleted_at: new Date(), is_deleted: true });

    return await this.technicianRepository.update(technicianId, { deleted_at: new Date(), is_deleted: true });

  }
}
