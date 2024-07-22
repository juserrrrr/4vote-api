import { Test, TestingModule } from '@nestjs/testing';
import { OpcaoService } from './opcao.service';
import { PrismaService } from '../prisma/prisma.service';
import { opcaoMock } from './mocks/opcao.mock';

describe('OpcaoService', () => {
  let opcaoService: OpcaoService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpcaoService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue(opcaoMock),
          },
        },
      ],
    }).compile();

    opcaoService = module.get<OpcaoService>(OpcaoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(opcaoService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return findOne opcao', async () => {
      const opcao1 = await opcaoService.findOne(opcaoMock.id);
      expect(opcao1).toEqual(opcaoMock);
    });

    it('should return null when no option is found', async () => {
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue(null);
      const opcaoNull = await opcaoService.findOne(4);
      expect(opcaoNull).toBeNull();
    });
  });
});
