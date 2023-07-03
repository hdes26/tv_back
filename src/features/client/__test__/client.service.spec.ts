import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository, UpdateResult } from 'typeorm';
import { Client, User } from '../../../../tv_common/database/core/entities';
import { RoleNameEnum } from '../../../../tv_common/database/core/enums/role.enum';
import { encryptPassword } from '../../../../tv_common/utils/functions';
import { CreateClientDto } from '../core/dto/create-client.dto';
import { UpdateClientDto } from '../core/dto/update-client.dto';
import { ClientService } from '../use-case/client.service';
import { NotFoundException } from '@nestjs/common';



describe('ClientService', () => {
    let clientService: ClientService;
    let clientRepository: Repository<Client>;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                ClientService,
                {
                    provide: getRepositoryToken(Client),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                }
            ],
        }).compile();

        clientService = moduleRef.get<ClientService>(ClientService);
        clientRepository = moduleRef.get<Repository<Client>>(getRepositoryToken(Client));
        userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('create', () => {

        it('should create a client', async () => {
            const createProjectDto: CreateClientDto = {
                email: 'hernan@gmail.com',
                name: 'Hernan',
                password: 'hernan123'
            };

            jest.spyOn(userRepository, 'save').mockResolvedValue({} as User);
            jest.spyOn(clientRepository, 'save').mockResolvedValue({} as Client);

            const result = await clientService.create(createProjectDto);

            expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                role: RoleNameEnum.CLIENT,
                email: createProjectDto.email,
                name: createProjectDto.name,
                password: createProjectDto.password,
            }));
            expect(clientRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                user: {} as User
            }));
            expect(result).toEqual({} as Client);
        });

    });

    describe('findAll', () => {
        it('should return all clients', async () => {

            jest.spyOn(clientRepository, 'find').mockResolvedValue([{} as Client]);

            const result = await clientService.findAll();

            expect(result).toEqual([{} as Client]);

        });
    });

    describe('findOne', () => {
        it('should return one client', async () => {

            const clientId = 'Client 1'

            jest.spyOn(clientRepository, 'findOneOrFail').mockResolvedValue({} as Client);

            const result = await clientService.findOne(clientId);

            expect(clientRepository.findOneOrFail).toHaveBeenCalledWith({ "relations": ["user"], "where": { "id": clientId } });
            expect(result).toEqual({} as Client);

        });
    });

    describe('update', () => {
        it('should update a client', async () => {
            // Arrange
            const clientId = '1';
            const client = { id: clientId, user: { id: 'user1' } } as Client;
            const updateClientDto: UpdateClientDto = {};
            const expectedResult = { affected: 1 } as UpdateResult;

            jest.spyOn(clientRepository, 'findOneOrFail').mockResolvedValue(client);
            jest.spyOn(userRepository, 'update').mockResolvedValue(expectedResult);

            // Act
            const result = await clientService.update(clientId, updateClientDto);

            // Assert
            expect(clientRepository.findOneOrFail).toHaveBeenCalledWith({
                relations: ['user'],
                where: { id: clientId },
            });
            expect(userRepository.update).toHaveBeenCalledWith(client.user.id, updateClientDto);

            expect(result).toBe(expectedResult);
        });

        it('should throw ConflictException when client is not found', async () => {
            // Arrange
            const clientId = '1';
            const updateClientDto: UpdateClientDto = {};

            // Simulate client not found in the database
            jest.spyOn(clientRepository, 'findOneOrFail').mockRejectedValue(new EntityNotFoundError(Client, { id: clientId }));
            jest.spyOn(userRepository, 'update');
            jest.spyOn(clientRepository, 'update');


            // Act and Assert
            await expect(clientService.update(clientId, updateClientDto)).rejects.toThrow(EntityNotFoundError);


            expect(userRepository.update).not.toHaveBeenCalled();
            expect(clientRepository.update).not.toHaveBeenCalled();

        });

    })

    describe('remove', () => {
        it('should remove a client', async () => {
            // Arrange
            const clientId = '1';
            const client = { id: clientId, user: { id: 'user1' } } as Client;
            const expectedResult = { affected: 1 } as UpdateResult;

            jest.spyOn(clientRepository, 'findOneOrFail').mockResolvedValue(client);
            jest.spyOn(userRepository, 'update').mockResolvedValue(expectedResult);
            jest.spyOn(clientRepository, 'update').mockResolvedValue(expectedResult);

            // Act
            const result = await clientService.remove(clientId);

            // Assert
            expect(clientRepository.findOneOrFail).toHaveBeenCalledWith({
                relations: ['user'],
                where: { id: clientId },
            });
            expect(userRepository.update).toHaveBeenCalledWith(client.user.id, {
                deleted_at: expect.any(Date),
                is_deleted: true,
            });
            expect(clientRepository.update).toHaveBeenCalledWith(client.user.id, {
                deleted_at: expect.any(Date),
                is_deleted: true,
            });
            expect(result).toBe(expectedResult);
        });

        it('should throw NotFoundException when client is not found', async () => {
            // Arrange
            const clientId = '1';

            jest.spyOn(clientRepository, 'findOneOrFail').mockRejectedValue(new NotFoundException('Client not found'));

            // Act and Assert
            await expect(clientService.remove(clientId)).rejects.toThrow(NotFoundException);
        });
    });

});
