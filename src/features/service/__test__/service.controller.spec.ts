import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from '../service.controller';
import { ServiceService } from '../use-case/service.service';
import { CreateServiceDto } from '../core/dto/create-service.dto';
import { UpdateServiceDto } from '../core/dto/update-service.dto';
import { Service, Technician, Client } from './../../../../tv_common/database/core/entities/';
import { Repository, UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ServiceController', () => {
    let controller: ServiceController;
    let serviceService: ServiceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ServiceController],
            providers: [
                ServiceService,
                {
                    provide: getRepositoryToken(Service),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Technician),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Client),
                    useClass: Repository,
                },
            ],
        }).compile();

        controller = module.get<ServiceController>(ServiceController);
        serviceService = module.get<ServiceService>(ServiceService);
    });

    describe('create', () => {
        it('should create a new service', async () => {
            // Arrange
            const createServiceDto: CreateServiceDto = {
                clientId: 'clientId',
                direction: 'tv 44 #102-80',
                description: 'Arreglo de pantalla lcd',
                date_to_attend: '2023/12/01'
            };

            jest.spyOn(serviceService, 'create').mockResolvedValue({} as any);

            // Act
            const result = await controller.create(createServiceDto);

            // Assert
            expect(serviceService.create).toHaveBeenCalledWith(createServiceDto);
            expect(result).toEqual({} as Service);
        });
    });

    describe('findAll', () => {
        it('should return a list of services', async () => {
            // Arrange
            const expectedResult = []; // Define the expected result

            jest.spyOn(serviceService, 'findAll').mockResolvedValue(expectedResult);

            // Act
            const result = await controller.findAll();

            // Assert
            expect(serviceService.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a service', async () => {
            // Arrange
            const serviceId = 'serviceId';
            const expectedResult = {} as any;

            jest.spyOn(serviceService, 'findOne').mockResolvedValue(expectedResult);

            // Act
            const result = await controller.findOne(serviceId);

            // Assert
            expect(serviceService.findOne).toHaveBeenCalledWith(serviceId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAllBytechnician', () => {
        it('should return a list of services for a technician', async () => {
            // Arrange
            const technicianId = 'technicianId';
            const expectedResult = []; // Define the expected result

            jest.spyOn(serviceService, 'findAllBytechnician').mockResolvedValue(expectedResult);

            // Act
            const result = await controller.findAllBytechnician(technicianId);

            // Assert
            expect(serviceService.findAllBytechnician).toHaveBeenCalledWith(technicianId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('should update a service', async () => {
            // Arrange
            const serviceId = 'serviceId';
            const updateServiceDto: UpdateServiceDto = {
                date_to_attend: '',
                description: '',
                direction: ''
            };
            const expectedResult = {} as UpdateResult;

            jest.spyOn(serviceService, 'update').mockResolvedValue(expectedResult);

            // Act
            const result = await controller.update(serviceId, updateServiceDto);

            // Assert
            expect(serviceService.update).toHaveBeenCalledWith(serviceId, updateServiceDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('finalize', () => {
        it('should finalize a service', async () => {
            // Arrange
            const serviceId = 'serviceId';
            const expectedResult = {} as UpdateResult;

            jest.spyOn(serviceService, 'finalize').mockResolvedValue(expectedResult);

            // Act
            const result = await controller.finalize(serviceId);

            // Assert
            expect(serviceService.finalize).toHaveBeenCalledWith(serviceId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove a service', async () => {
            // Arrange
            const serviceId = 'serviceId';
            const expectedResult = {} as UpdateResult;

            jest.spyOn(serviceService, 'remove').mockResolvedValue(expectedResult);

            // Act
            const result = await controller.remove(serviceId);

            // Assert
            expect(serviceService.remove).toHaveBeenCalledWith(serviceId);
            expect(result).toEqual(expectedResult);
        });
    });
});
