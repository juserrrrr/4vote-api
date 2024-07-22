import { Test, TestingModule } from '@nestjs/testing';
import { PerguntasService } from './perguntas.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerguntaDto } from './dto/create-pergunta.dto';

const question: CreatePerguntaDto = {
  texto: 'oi',
  URLimagem: null,
  opcoes: [
    { texto: 'oi', imagemOpcao: null },
    { texto: 'ola', imagemOpcao: null },
  ],
};

describe('PerguntasService', () => {
  let service: PerguntasService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerguntasService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
            pergunta: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PerguntasService>(PerguntasService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a question', async () => {
      // Arrange: Define o ID da pergunta que será buscada e configura o mock do Prisma para retornar a pergunta criada
      const id = 1;
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(question);

      // Act: Chama o método findOne do serviço com o ID especificado
      const result = await service.findOne(id);

      // Assert: Verifica se o resultado é igual à pergunta criada e se o método findUnique foi chamado com o ID correto
      expect(result).toEqual(question);
    });

    it('should return null', async () => {
      // Arrange: Define o ID da pergunta que será buscada e configura o mock do Prisma para retornar null
      const id = 2;
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(null);

      // Act: Chama o método findOne do serviço com o ID especificado
      const result = await service.findOne(id);

      // Assert: Verifica se o resultado é null e se o método findUnique foi chamado com o ID correto
      expect(result).toBeNull();
    });
  });
});
