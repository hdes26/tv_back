import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository, UpdateResult } from 'typeorm';
import { Technician, User } from '../../../../tv_common/database/core/entities';
import { RoleNameEnum } from '../../../../tv_common/database/core/enums/role.enum';
import { CreateTechnicianDto } from '../core/dto/create-technician.dto';
import { UpdateTechnicianDto } from '../core/dto/update-technician.dto';
import { TechnicianService } from '../use-case/technician.service';
import { NotFoundException } from '@nestjs/common';



describe('TechnicianService', () => {
    let technicianService: TechnicianService;
    let technicianRepository: Repository<Technician>;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                TechnicianService,
                {
                    provide: getRepositoryToken(Technician),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                }
            ],
        }).compile();

        technicianService = moduleRef.get<TechnicianService>(TechnicianService);
        technicianRepository = moduleRef.get<Repository<Technician>>(getRepositoryToken(Technician));
        userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('create', () => {

        it('should create a technician', async () => {
            const createTechnicianDto: CreateTechnicianDto = {
                email: 'hernan@gmail.com',
                name: 'Hernan',
                password: 'hernan123'
            };

            jest.spyOn(userRepository, 'save').mockResolvedValue({} as User);
            jest.spyOn(technicianRepository, 'save').mockResolvedValue({} as Technician);

            const result = await technicianService.create(createTechnicianDto);

            expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                role: RoleNameEnum.TECHNICIAN,
                email: createTechnicianDto.email,
                name: createTechnicianDto.name,
                password: createTechnicianDto.password,
            }));
            expect(technicianRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                user: {} as User
            }));
            expect(result).toEqual({} as Technician);
        });

    });

    describe('findAll', () => {
        it('should return all technicians', async () => {

            jest.spyOn(technicianRepository, 'find').mockResolvedValue([{} as Technician]);

            const result = await technicianService.findAll();

            expect(result).toEqual([{} as Technician]);

        });
    });

    describe('findOne', () => {
        it('should return one technician', async () => {

            const technicianId = 'Technician 1'

            jest.spyOn(technicianRepository, 'findOneOrFail').mockResolvedValue({} as Technician);

            const result = await technicianService.findOne(technicianId);

            expect(technicianRepository.findOneOrFail).toHaveBeenCalledWith({ "relations": ["user"], "where": { "id": technicianId } });
            expect(result).toEqual({} as Technician);

        });
    });

    describe('update', () => {
        it('should update a technician', async () => {
            // Arrange
            const technicianId = '1';
            const technician = { id: technicianId, user: { id: 'user1' } } as Technician;
            const updateTechnicianDto: UpdateTechnicianDto = {};
            const expectedResult = { affected: 1 } as UpdateResult;

            jest.spyOn(technicianRepository, 'findOneOrFail').mockResolvedValue(technician);
            jest.spyOn(userRepository, 'update').mockResolvedValue(expectedResult);

            // Act
            const result = await technicianService.update(technicianId, updateTechnicianDto);

            // Assert
            expect(technicianRepository.findOneOrFail).toHaveBeenCalledWith({
                relations: ['user'],
                where: { id: technicianId },
            });
            expect(userRepository.update).toHaveBeenCalledWith(technician.user.id, updateTechnicianDto);

            expect(result).toBe(expectedResult);
        });

        it('should throw ConflictException when technician is not found', async () => {
            // Arrange
            const technicianId = '1';
            const updateTechnicianDto: UpdateTechnicianDto = {};

            // Simulate technician not found in the database
            jest.spyOn(technicianRepository, 'findOneOrFail').mockRejectedValue(new EntityNotFoundError(Technician, { id: technicianId }));
            jest.spyOn(userRepository, 'update');
            jest.spyOn(technicianRepository, 'update');


            // Act and Assert
            await expect(technicianService.update(technicianId, updateTechnicianDto)).rejects.toThrow(EntityNotFoundError);


            expect(userRepository.update).not.toHaveBeenCalled();
            expect(technicianRepository.update).not.toHaveBeenCalled();

        });

    })

    describe('remove', () => {
        it('should remove a technician', async () => {
            // Arrange
            const technicianId = '1';
            const technician = { id: technicianId, user: { id: 'user1' } } as Technician;
            const expectedResult = { affected: 1 } as UpdateResult;

            jest.spyOn(technicianRepository, 'findOneOrFail').mockResolvedValue(technician);
            jest.spyOn(userRepository, 'update').mockResolvedValue(expectedResult);
            jest.spyOn(technicianRepository, 'update').mockResolvedValue(expectedResult);

            // Act
            const result = await technicianService.remove(technicianId);

            // Assert
            expect(technicianRepository.findOneOrFail).toHaveBeenCalledWith({
                relations: ['user'],
                where: { id: technicianId },
            });
            expect(userRepository.update).toHaveBeenCalledWith(technician.user.id, {
                deleted_at: expect.any(Date),
                is_deleted: true,
            });
            expect(technicianRepository.update).toHaveBeenCalledWith(technician.user.id, {
                deleted_at: expect.any(Date),
                is_deleted: true,
            });
            expect(result).toBe(expectedResult);
        });

        it('should throw NotFoundException when technician is not found', async () => {
            // Arrange
            const technicianId = '1';

            jest.spyOn(technicianRepository, 'findOneOrFail').mockRejectedValue(new NotFoundException('Technician not found'));

            // Act and Assert
            await expect(technicianService.remove(technicianId)).rejects.toThrow(NotFoundException);
        });
    });

});
