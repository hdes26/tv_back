import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Client, Service, Technician } from './../../../../tv_common/database/core/entities/';
import { UpdateServiceDto } from '../core/dto/update-service.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { TechnicianStatusEnum, ServiceStatusEnum } from './../../../../tv_common/database/core/enums';
import { ServiceService } from '../use-case/service.service';


describe('ServiceService', () => {
    let serviceService: ServiceService;
    let technicianRepository: Repository<Technician>;
    let clientRepository: Repository<Client>;
    let serviceRepository: Repository<Service>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ServiceService,
                {
                    provide: getRepositoryToken(Technician),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Client),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Service),
                    useClass: Repository,
                },
            ],
        }).compile();

        serviceService = module.get<ServiceService>(ServiceService);
        technicianRepository = module.get<Repository<Technician>>(getRepositoryToken(Technician));
        clientRepository = module.get<Repository<Client>>(getRepositoryToken(Client));
        serviceRepository = module.get<Repository<Service>>(getRepositoryToken(Service));
    });

    describe('create', () => {
        it('should create a service', async () => {
            const clientId = '';
            const createServiceDto = {
                direction: 'tv 44 #102-80',
                description: 'Arreglo de pantalla lcd',
                date_to_attend: '2023/12/01',
            };

            const clientFound = { id: clientId } as Client;
            const technicianFound = { id: 'technicianId' } as Technician;

            jest.spyOn(clientRepository, 'findOneOrFail').mockResolvedValue(clientFound);
            jest.spyOn(technicianRepository, 'find').mockResolvedValue([technicianFound]);
            jest.spyOn(serviceRepository, 'save').mockResolvedValue({} as Service);

            // Act
            const result = await serviceService.create({ clientId, ...createServiceDto });

            // Assert
            expect(clientRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: clientId } });
            expect(technicianRepository.find).toHaveBeenCalledWith({ where: { status: TechnicianStatusEnum.AVAILABLE } });
            expect(serviceRepository.save).toHaveBeenCalledWith(expect.objectContaining({ ...createServiceDto, client: expect.objectContaining({ id: clientFound.id }), technician: expect.objectContaining({ id: technicianFound.id }) }));
            expect(result).toEqual({} as Service);
        });

        it('should throw an exception when no technicians are available', async () => {
            // Arrange
            const clientId = 'clientId';
            const createServiceDto = {
                direction: 'tv 44 #102-80',
                description: 'Arreglo de pantalla lcd',
                date_to_attend: '2023/12/01',
            };

            const clientFound = { id: clientId } as Client;

            jest.spyOn(clientRepository, 'findOneOrFail').mockResolvedValue(clientFound);
            jest.spyOn(technicianRepository, 'find').mockResolvedValue([]);

            // Act & Assert
            await expect(serviceService.create({ clientId, ...createServiceDto })).rejects.toThrowError(InternalServerErrorException);
        });

    });

    describe('findAll', () => {
        it('should return all services', async () => {

            jest.spyOn(serviceRepository, 'find').mockResolvedValue([{} as Service]);

            const result = await serviceService.findAll();

            expect(serviceRepository.find).toHaveBeenCalledTimes(1);
            expect(result).toEqual([{} as Service]);
        });


    });

    describe('findOne', () => {

        it('should return the specified service', async () => {
            const serviceId = 'service1';

            jest.spyOn(serviceRepository, 'findOneOrFail').mockResolvedValue({} as Service);


            const result = await serviceService.findOne(serviceId);

            expect(serviceRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: serviceId } });
            expect(result).toEqual({} as Service);
        });

    });

    describe('findAllByTechnician', () => {
        it('should return all services for a technician', async () => {
            const technicianId = 'technicianId';

            jest.spyOn(serviceRepository, 'find').mockResolvedValue([{} as Service]);

            const result = await serviceService.findAllBytechnician(technicianId);

            expect(serviceRepository.find).toHaveBeenCalledWith({
                relations: ['technician'],
                where: {
                    technician: {
                        id: technicianId,
                    },
                },
            });
            expect(result).toEqual([{} as Service]);
        });
    });

    describe('update', () => {
        it('should update the service', async () => {
            const serviceId = 'serviceId';
            const updateServiceDto: UpdateServiceDto = {
                description: '',
                date_to_attend: '',
                direction: ''
            };
            const expectedResult = { affected: 1 } as UpdateResult;


            jest.spyOn(serviceRepository, 'update').mockResolvedValue(expectedResult);


            const result = await serviceService.update(serviceId, updateServiceDto);

            expect(serviceRepository.update).toHaveBeenCalledWith(serviceId, updateServiceDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('finalize', () => {
        it('should finalize the service', async () => {
            const serviceId = 'serviceId';
            const expectedResult = {} as UpdateResult;


            jest.spyOn(serviceRepository, 'update').mockResolvedValue(expectedResult);

            const result = await serviceService.finalize(serviceId);

            expect(serviceRepository.update).toHaveBeenCalledWith(serviceId, { status: ServiceStatusEnum.FINALIZED });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove the service', async () => {
            // Arrange
            const serviceId = 'serviceId';
            const expectedResult = {} as UpdateResult;

            jest.spyOn(clientRepository, 'update').mockResolvedValue(expectedResult);

            // Act
            const result = await serviceService.remove(serviceId);

            // Assert
            expect(clientRepository.update).toHaveBeenCalledWith(serviceId, {
                deleted_at: expect.any(Date),
                is_deleted: true,
            });
            expect(result).toEqual(expectedResult);
        });
    });

});
