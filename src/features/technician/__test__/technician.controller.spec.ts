import { Test, TestingModule } from '@nestjs/testing';
import { TechnicianController } from '../technician.controller';
import { TechnicianService } from '../use-case/technician.service';
import { CreateTechnicianDto } from '../core/dto/create-technician.dto';
import { Technician, User } from '../../../../tv_common/database/core/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateTechnicianDto } from '../core/dto/update-technician.dto';

describe('TenchinicianController', () => {
    let technicianController: TechnicianController;
    let technicianService: TechnicianService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TechnicianController],
            providers: [
                TechnicianService,
                {
                    provide: getRepositoryToken(Technician),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        technicianController = module.get<TechnicianController>(TechnicianController);
        technicianService = module.get<TechnicianService>(TechnicianService);
    });

    describe('create', () => {
        it('should create a technician', async () => {
            // Arrange
            const createTechnicianDto: CreateTechnicianDto = {
                email: 'hernan@example.com',
                name: 'Hernan Escorcia',
                password: 'password123',
            };

            jest.spyOn(technicianService, 'create').mockResolvedValue({} as any);

            const result = await technicianController.create(createTechnicianDto);

            expect(technicianService.create).toHaveBeenCalledWith(createTechnicianDto);
            expect(result).toStrictEqual({} as Technician);
        });
    });

    describe('findAll', () => {
        it('should return all technicians', async () => {
            const expectedResult = [];

            jest.spyOn(technicianService, 'findAll').mockResolvedValue(expectedResult);

            const result = await technicianController.findAll();

            expect(result).toBe(expectedResult);
            expect(technicianService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a technician', async () => {
            // Arrange
            const technicianId = '1';
            const expectedResult = {} as any;
            jest.spyOn(technicianService, 'findOne').mockResolvedValue(expectedResult);

            // Act
            const result = await technicianController.findOne(technicianId);

            // Assert
            expect(result).toBe(expectedResult);
            expect(technicianService.findOne).toHaveBeenCalledWith(technicianId);
        });
    });

    describe('update', () => {
        it('should update a technician', async () => {
            // Arrange
            const technicianId = '1';
            const updateTechnicianDto: UpdateTechnicianDto = {
                email: 'hernan@example.com',
                name: 'Hernan Escorcia',
                password: 'newpassword123',
            };
            const expectedResult = {} as UpdateResult;

            jest.spyOn(technicianService, 'update').mockResolvedValue(expectedResult);

            // Act
            const result = await technicianController.update(technicianId, updateTechnicianDto);

            // Assert
            expect(result).toBe(expectedResult);
            expect(technicianService.update).toHaveBeenCalledWith(technicianId, updateTechnicianDto);
        });
    });

    describe('remove', () => {
        it('should remove a technician', async () => {
          // Arrange
          const technicianId = '1';
          const expectedResult = {} as UpdateResult;
    
          jest.spyOn(technicianService, 'remove').mockResolvedValue(expectedResult);
    
          // Act
          const result = await technicianController.remove(technicianId);
    
          // Assert
          expect(result).toBe(expectedResult);
          expect(technicianService.remove).toHaveBeenCalledWith(technicianId);
        });
      });

});
