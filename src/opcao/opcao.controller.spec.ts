import { Test, TestingModule } from '@nestjs/testing';
import { OpcaoController } from './opcao.controller';
import { OpcaoService } from './opcao.service';
import { JwtService } from '@nestjs/jwt';
import { opcaoMock } from './mocks/opcao.mock';

describe('OpcaoController', () => {
  let opcaoController: OpcaoController;
  let opcaoService: OpcaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpcaoController],
      providers: [
        {
          provide: OpcaoService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(opcaoMock),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    opcaoController = module.get<OpcaoController>(OpcaoController);
    opcaoService = module.get<OpcaoService>(OpcaoService);
  });

  it('should be defined', () => {
    expect(opcaoController).toBeDefined();
    expect(opcaoService).toBeDefined();
  });
  describe('findOne', () => {
    it('should return findOne opcao', async () => {
      const opcao1 = await opcaoService.findOne(opcaoMock.id);

      expect(opcao1).toEqual(opcaoMock);
    });
    it('should return different findOne opcao', async () => {
      const opcao1 = await opcaoService.findOne(opcaoMock.id);
      const opcao2 = { id: 2, texto: 'Texto opcao 2' };
      jest.spyOn(opcaoService, 'findOne').mockResolvedValue(opcao2);

      expect(opcao1).not.toEqual(opcao2);
    });
  });
});
