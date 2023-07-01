import { Injectable } from '@nestjs/common';
import { CreateClientDto } from '../core/dto/create-client.dto';
import { UpdateClientDto } from '../core/dto/update-client.dto';
import { Client, User } from 'tv_common/database/core/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { encryptPassword } from 'tv_common/utils/functions';
import { RoleNameEnum } from 'tv_common/database/core/enums';

@Injectable()
export class ClientService {

  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createClientDto: CreateClientDto) {

    createClientDto.password = encryptPassword(createClientDto.password);

    const user = await this.userRepository.save({ role: RoleNameEnum.CLIENT, ...createClientDto });

    const newClient = await this.clientRepository.save({ user });

    return newClient;
  }

  async findAll() {
    const query = await this.clientRepository.createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .getRawMany()

    return query;
  }

  async findOne(clientId: string) {
    const query = await this.clientRepository.createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .where('client.id = :clientId', { clientId })
      .getRawOne()

    return query;
  }

  async update(clientId: string, updateClientDto: UpdateClientDto) {
    if (updateClientDto.password) {
      updateClientDto.password = encryptPassword(updateClientDto.password);
    }
    const client = await this.clientRepository.createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .select('user')
      .where('client.id = :clientId', { clientId })
      .getRawOne();

    return await this.userRepository.update(client.user_id, updateClientDto);

  }

  async remove(clientId: string) {
    const client = await this.clientRepository.createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .where('client.id = :clientId', { clientId })
      .getRawOne();

    await this.userRepository.update(client.user_id, { deleted_at: new Date(), is_deleted: true });

    return await this.clientRepository.update(clientId, { deleted_at: new Date(), is_deleted: true });

  }
}
