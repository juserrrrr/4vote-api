import { Test, TestingModule } from '@nestjs/testing';
import { VotoController } from './voto.controller';
import { VotoService } from './voto.service';
import { CreateVotoDto } from './dto/create-voto.dto';

const votos: Record<number, CreateVotoDto> = {
  1: {
    opcoesVotadas: [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }, { idOption: 4 }],
  },
  2: {
    opcoesVotadas: [{ idOption: 5 }, { idOption: 6 }, { idOption: 7 }, { idOption: 8 }],
  },
};

describe('VotoController', () => {
  let controller: VotoController;
  let service: VotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotoController],
      providers: [
        {
          provide: VotoService,
          useValue: {
            findOne: jest.fn().mockImplementation((id: number) => {
              return Promise.resolve(votos[id] || null);
            }),
          },
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
    it('should return the correct voto for existing IDs', async () => {
      // Act
      const result1 = await controller.findOne(1);
      const result2 = await controller.findOne(2);

      // Assert
      expect(result1).toEqual(votos[1]);
      expect(result2).toEqual(votos[2]);
    });

    it('should return null if the voto is not found', async () => {
      // Act
      const result = await controller.findOne(99);

      // Assert
      expect(result).toBeNull();
    });
  });
});
