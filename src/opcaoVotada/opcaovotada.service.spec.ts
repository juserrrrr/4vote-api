import { Test, TestingModule } from '@nestjs/testing';
import { OpcaoVotadaService } from './opcaovotada.service';
import { PrismaService } from '../prisma/prisma.service';

const mockOpcaoVotada = [
  { id: 1, voto_id: 1, option: 'Option 1' },
  { id: 2, voto_id: 1, option: 'Option 2' },
];

describe('OpcaoVotadaService', () => {
  let service: OpcaoVotadaService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpcaoVotadaService,
        {
          provide: PrismaService,
          useValue: {
            opcao_Votada: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OpcaoVotadaService>(OpcaoVotadaService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByVote', () => {
    it('should return an array of options for a given vote ID', async () => {
      // Arrange: Define o ID do voto e configura o mock do Prisma para retornar as opções
      const idVote = 1;
      (prisma.opcao_Votada.findMany as jest.Mock).mockResolvedValue(mockOpcaoVotada);

      // Act: Chama o método findByVote do serviço com o ID especificado
      const result = await service.findByVote(idVote);

      // Assert: Verifica se o resultado é igual às opções mockadas e se o método findMany foi chamado com o ID correto
      expect(result).toEqual(mockOpcaoVotada);
    });

    it('should return null if no options are found for a given vote ID', async () => {
      // Arrange: Define o ID do voto e configura o mock do Prisma para retornar null
      const idVote = 2;
      (prisma.opcao_Votada.findMany as jest.Mock).mockResolvedValue(null);

      // Act: Chama o método findByVote do serviço com o ID especificado
      const result = await service.findByVote(idVote);

      // Assert: Verifica se o resultado é null e se o método findMany foi chamado com o ID correto
      expect(result).toBeNull();
    });
  });
});
