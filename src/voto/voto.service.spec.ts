import { Test, TestingModule } from '@nestjs/testing';
import { VotoService } from './voto.service';
import { PrismaService } from '../prisma/prisma.service';

const vote = {
  id: 1,
  opcoesVotadas: [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }, { idOption: 4 }],
};

describe('VotoService', () => {
  let service: VotoService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotoService,
        {
          provide: PrismaService,
          useValue: {
            voto: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<VotoService>(VotoService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('Aqui deve retornar o voto', async () => {
      // Arrange: Define o ID do voto que será buscado e configura o mock do Prisma para retornar o vote criado
      const id = 1;
      (prisma.voto.findUnique as jest.Mock).mockResolvedValue(vote);

      // Act: Chama o método findOne do serviço com o ID especificado
      const result = await service.findOne(id);

      // Assert: Verifica se o resultado é igual ao votecriado e se o método findUnique foi chamado com o ID correto
      expect(result).toEqual(vote);
      expect(prisma.voto.findUnique).toHaveBeenCalledWith({ where: { id } });
    });

    it('Aqui deve retornar null', async () => {
      // Arrange: Define o ID do voto que será buscado e configura o mock do Prisma para retornar null
      const id = 2;
      (prisma.voto.findUnique as jest.Mock).mockResolvedValue(null);

      // Act: Chama o método findOne do serviço com o ID especificado
      const result = await service.findOne(id);

      // Assert: Verifica se o resultado é null e se o método findUnique foi chamado com o ID correto
      expect(result).toBeNull();
      expect(prisma.voto.findUnique).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
