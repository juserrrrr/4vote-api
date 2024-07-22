import { Test, TestingModule } from '@nestjs/testing';
import { PerguntasController } from './perguntas.controller';
import { PerguntasService } from './perguntas.service';
import { JwtService } from '@nestjs/jwt';

const perguntas = {
  1: { id: 1, texto: 'Pergunta 1', URLimagem: 'http://image.url', opcoes: [] },
  2: { id: 2, texto: 'Pergunta 2', URLimagem: 'http://image.url2', opcoes: [] },
};

describe('PerguntasController', () => {
  let controller: PerguntasController;
  let service: PerguntasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerguntasController],
      providers: [
        {
          provide: PerguntasService,
          useValue: {
            findOne: jest.fn().mockImplementation((id: number) => {
              return Promise.resolve(perguntas[id] || null);
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PerguntasController>(PerguntasController);
    service = module.get<PerguntasService>(PerguntasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the correct pergunta for existing IDs', async () => {
      // Act: Chama o método findOne do controller com IDs 1 e 2
      const result1 = await controller.findOne(1);
      const result2 = await controller.findOne(2);

      // Assert: Verifica se os resultados são iguais aos votos mockados
      expect(result1).toEqual(perguntas[1]);
      expect(result2).toEqual(perguntas[2]);
    });

    it('should return null if the pergunta is not found', async () => {
      // Act: Chama o método findOne do controller com um ID inexistente
      const result = await controller.findOne(99);

      // Assert: Verifica se o resultado é null
      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(99);
    });
  });
});
