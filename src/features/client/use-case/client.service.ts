import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from '../core/dto/create-client.dto';
import { UpdateClientDto } from '../core/dto/update-client.dto';
import { Client, User } from './../../../../tv_common/database/core/entities/';
import { encryptPassword } from './../../../../tv_common/utils/functions';
import { RoleNameEnum } from './../../../../tv_common/database/core/enums';

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

    const newUser = await this.clientRepository.save({ user });
    return newUser;
  }

  async findAll() {
    const clients = await this.clientRepository.find({ relations: ['user'] })

    return clients;
  }

  async findOne(clientId: string) {
    const client = await this.clientRepository.findOneOrFail({ relations: ['user'], where: { id: clientId } })

    return client;
  }

  async update(clientId: string, updateClientDto: UpdateClientDto) {
    if (updateClientDto.password) {
      updateClientDto.password = encryptPassword(updateClientDto.password);
    }
    const client = await this.clientRepository.findOneOrFail({ relations: ['user'], where: { id: clientId } });

    return await this.userRepository.update(client.user.id, updateClientDto);

  }

  async remove(clientId: string) {
    const client = await this.clientRepository.findOneOrFail({ relations: ['user'], where: { id: clientId } });


    await this.userRepository.update(client.user.id, { deleted_at: new Date(), is_deleted: true });

    return await this.clientRepository.update(client.user.id, { deleted_at: new Date(), is_deleted: true });

  }
}
