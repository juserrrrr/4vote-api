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
    it('Aqui deve retornar os votos', async () => {
      // Act: Chama o método findOne do controller com IDs 1 e 2
      const result1 = await controller.findOne(1);
      const result2 = await controller.findOne(2);

      // Assert: Verifica se os resultados são iguais aos votos mockados
      expect(result1).toEqual(votos[1]);
      expect(result2).toEqual(votos[2]);
    });

    it('Aqui deve retornar null', async () => {
      // Act: Chama o método findOne do controller com um ID inexistente (99)
      const result = await controller.findOne(99);

      // Assert: Verifica se o resultado é null
      expect(result).toBeNull();
    });
  });
});
