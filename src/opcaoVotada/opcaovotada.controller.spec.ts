import { Test, TestingModule } from '@nestjs/testing';
import { OpcaoVotadaController } from './opcaovotada.controller';
import { OpcaoVotadaService } from './opcaovotada.service';

const mockOpcaoVotada = [
  { id: 1, voto_id: 1, option: 'Option 1' },
  { id: 2, voto_id: 1, option: 'Option 2' },
];

describe('OpcaoVotadaController', () => {
  let controller: OpcaoVotadaController;
  let service: OpcaoVotadaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpcaoVotadaController],
      providers: [
        {
          provide: OpcaoVotadaService,
          useValue: {
            findByVote: jest.fn().mockImplementation((idVote: number) => {
              return Promise.resolve(mockOpcaoVotada.filter((opcao) => opcao.voto_id === idVote));
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<OpcaoVotadaController>(OpcaoVotadaController);
    service = module.get<OpcaoVotadaService>(OpcaoVotadaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findByVote', () => {
    it('should return the correct options for an existing vote ID', async () => {
      // Act: Chama o método findByVote do controller com ID 1
      const result = await controller.findByVote(1);

      // Assert: Verifica se o resultado é igual às opções mockadas
      expect(result).toEqual(mockOpcaoVotada.filter((opcao) => opcao.voto_id === 1));
    });

    it('should return an empty array if no options are found for the given vote ID', async () => {
      // Act: Chama o método findByVote do controller com um ID inexistente
      const result = await controller.findByVote(99);

      // Assert: Verifica se o resultado é um array vazio
      expect(result).toEqual([]);
      expect(service.findByVote).toHaveBeenCalledWith(99);
    });
  });
});
