import { Test, TestingModule } from '@nestjs/testing';
import { VotoController } from './voto.controller';
import { VotoService } from './voto.service';
import { CreateVotoDto } from './dto/create-voto.dto';

const voto1: CreateVotoDto = { id: 1, data: '2004/04/04', hash: 'vhvggxfg' };

describe('VotoController', () => {
  let controller: VotoController;
  let service: VotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotoController],
      providers: [
        VotoService,
        {
          provide: VotoService,
          useValue: { findOne: jest.fn().mockResolvedValue(voto1) },
        },
      ],
    }).compile();

    controller = module.get<VotoController>(VotoController);
    service = module.get<VotoService>(VotoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('Aqui deve retornar o voto com sucesso', async () => {
      // Act
      const result = await controller.findOne(1);
      // Assert
      expect(result).toEqual(voto1);
      expect(typeof result).toEqual('object');
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
    it('Aqui deve retornar uma exceção', () => {
      // Arrange
      jest.spyOn(service, 'findOne').mockImplementation(() => {
        throw new Error('Erro de teste');
      });
      // Assert
      expect(() => controller.findOne(5)).rejects.toThrowError('Erro de teste');
    });
  });
});
