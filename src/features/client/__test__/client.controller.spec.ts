import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from '../client.controller';
import { ClientService } from '../use-case/client.service';
import { CreateClientDto } from '../core/dto/create-client.dto';
import { Client, User } from '../../../../tv_common/database/core/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateClientDto } from '../core/dto/update-client.dto';

describe('ClientController', () => {
    let clientController: ClientController;
    let clientService: ClientService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClientController],
            providers: [
                ClientService,
                {
                    provide: getRepositoryToken(Client),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        clientController = module.get<ClientController>(ClientController);
        clientService = module.get<ClientService>(ClientService);
    });

    describe('create', () => {
        it('should create a client', async () => {
            // Arrange
            const createClientDto: CreateClientDto = {
                email: 'hernan@example.com',
                name: 'Hernan Escorcia',
                password: 'password123',
            };

            jest.spyOn(clientService, 'create').mockResolvedValue({} as any);

            const result = await clientController.create(createClientDto);

            expect(clientService.create).toHaveBeenCalledWith(createClientDto);
            expect(result).toStrictEqual({} as Client);
        });
    });

    describe('findAll', () => {
        it('should return all clients', async () => {
            const expectedResult = [];

            jest.spyOn(clientService, 'findAll').mockResolvedValue(expectedResult);

            const result = await clientController.findAll();

            expect(result).toBe(expectedResult);
            expect(clientService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a client', async () => {
            // Arrange
            const clientId = '1';
            const expectedResult = {} as any;
            jest.spyOn(clientService, 'findOne').mockResolvedValue(expectedResult);

            // Act
            const result = await clientController.findOne(clientId);

            // Assert
            expect(result).toBe(expectedResult);
            expect(clientService.findOne).toHaveBeenCalledWith(clientId);
        });
    });

    describe('update', () => {
        it('should update a client', async () => {
            // Arrange
            const clientId = '1';
            const updateClientDto: UpdateClientDto = {
                email: 'hernan@example.com',
                name: 'Hernan Escorcia',
                password: 'newpassword123',
            };
            const expectedResult = {} as UpdateResult;

            jest.spyOn(clientService, 'update').mockResolvedValue(expectedResult);

            // Act
            const result = await clientController.update(clientId, updateClientDto);

            // Assert
            expect(result).toBe(expectedResult);
            expect(clientService.update).toHaveBeenCalledWith(clientId, updateClientDto);
        });
    });

    describe('remove', () => {
        it('should remove a client', async () => {
          // Arrange
          const clientId = '1';
          const expectedResult = {} as UpdateResult;
    
          jest.spyOn(clientService, 'remove').mockResolvedValue(expectedResult);
    
          // Act
          const result = await clientController.remove(clientId);
    
          // Assert
          expect(result).toBe(expectedResult);
          expect(clientService.remove).toHaveBeenCalledWith(clientId);
        });
      });

});
