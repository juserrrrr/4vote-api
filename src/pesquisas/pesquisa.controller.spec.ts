import { PesquisaController } from './pesquisa.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { PesquisaService } from './pesquisa.service';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { JwtService } from '@nestjs/jwt';
import { filterPesquisaDto } from './dto/filter-pesquisa.dto';

describe('PesquisaController', () => {
  let controller: PesquisaController;
  let service: PesquisaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PesquisaController],
      providers: [
        PesquisaService,
        JwtService,
        {
          provide: PesquisaService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              titulo: 'titulo_teste',
              descricao: 'descricao_teste',
              dataTermino: '2021-10-10',
              ehPublico: true,
              URLimagem: 'url',
              ehVotacao: true,
              perguntas: [],
              tags: [],
            }),
            findByCode: jest.fn().mockResolvedValue([
              {
                titulo: 'titulo_teste',
                descricao: 'descricao_teste',
                dataTermino: '2021-10-10',
                ehPublico: true,
                URLimagem: 'url',
                ehVotacao: true,
                perguntas: [],
                tags: [],
                arquivado: false,
                usuario: {},
                respostas: [],
                tagsPesquisa: [],
              },
              {
                titulo: 'titulo_teste2',
                descricao: 'descricao_teste2',
                dataTermino: '2021-10-10',
                ehPublico: true,
                URLimagem: 'url',
                ehVotacao: true,
                perguntas: [],
                tags: [],
                arquivado: false,
                usuario: {},
                respostas: [],
                tagsPesquisa: [],
              },
            ]),
            filterSurveys: jest.fn().mockResolvedValue([
              {
                titulo: 'titulo_teste',
                descricao: 'descricao_teste',
                dataTermino: '2021-10-10',
                ehPublico: true,
                URLimagem: 'url',
                ehVotacao: true,
                perguntas: [],
                tags: [],
                arquivado: false,
                usuario: {},
                respostas: [],
                tagsPesquisa: [],
              },
              {
                titulo: 'titulo_teste2',
                descricao: 'descricao_teste2',
                dataTermino: '2021-10-11',
                ehPublico: false,
                URLimagem: 'url2',
                ehVotacao: false,
                perguntas: [],
                tags: [],
                arquivado: true,
                usuario: {},
                respostas: [],
                tagsPesquisa: [],
              },
            ]),
            updateArquivar: jest.fn().mockResolvedValue({
              idSurvey: 1,
              idUser: 1,
              arquivado: true,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<PesquisaController>(PesquisaController);
    service = module.get<PesquisaService>(PesquisaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a research', async () => {
      const createPerguntaDto: CreatePesquisaDto = {
        titulo: 'titulo_teste',
        descricao: 'descricao_teste',
        dataTermino: '2021-10-10',
        ehPublico: true,
        URLimagem: 'url',
        ehVotacao: true,
        perguntas: [],
        tags: [],
      };
      const mockUser = { user: { sub: 1 } };
      const result = await controller.create(createPerguntaDto, mockUser);
      expect(result).toEqual({
        titulo: 'titulo_teste',
        descricao: 'descricao_teste',
        dataTermino: '2021-10-10',
        ehPublico: true,
        URLimagem: 'url',
        ehVotacao: true,
        perguntas: [],
        tags: [],
      });
      expect(service.create).toHaveBeenCalledWith(createPerguntaDto, mockUser.user.sub);
    });
  });
  describe('findAll', () => {
    it('should return all researches', async () => {
      const result = await controller.findAll('code');
      expect(result).toEqual([
        {
          titulo: 'titulo_teste',
          descricao: 'descricao_teste',
          dataTermino: '2021-10-10',
          ehPublico: true,
          URLimagem: 'url',
          ehVotacao: true,
          perguntas: [],
          tags: [],
          arquivado: false,
          usuario: {},
          respostas: [],
          tagsPesquisa: [],
        },
        {
          titulo: 'titulo_teste2',
          descricao: 'descricao_teste2',
          dataTermino: '2021-10-10',
          ehPublico: true,
          URLimagem: 'url',
          ehVotacao: true,
          perguntas: [],
          tags: [],
          arquivado: false,
          usuario: {},
          respostas: [],
          tagsPesquisa: [],
        },
      ]);
      expect(service.findByCode).toHaveBeenCalledWith('code');
    });
  });
  describe('filter', () => {
    it('should return filtered researches', async () => {
      const filterQuery: filterPesquisaDto = {
        arquivada: true,
      };
      const request = { user: { sub: 1 } };
      const result = await controller.filter(filterQuery, request);
      expect(result).toEqual([
        {
          titulo: 'titulo_teste',
          descricao: 'descricao_teste',
          dataTermino: '2021-10-10',
          ehPublico: true,
          URLimagem: 'url',
          ehVotacao: true,
          perguntas: [],
          tags: [],
          arquivado: false,
          usuario: {},
          respostas: [],
          tagsPesquisa: [],
        },
        {
          titulo: 'titulo_teste2',
          descricao: 'descricao_teste2',
          dataTermino: '2021-10-11',
          ehPublico: false,
          URLimagem: 'url2',
          ehVotacao: false,
          perguntas: [],
          tags: [],
          arquivado: true,
          usuario: {},
          respostas: [],
          tagsPesquisa: [],
        },
      ]);
      expect(service.filterSurveys).toHaveBeenCalledWith(filterQuery, request.user.sub);
    });
  });
  describe('arquivar', () => {
    it('should archive a research', async () => {
      const idSurvey = 1;
      const request = { user: { sub: 1 } };
      const result = await controller.updateArquivar(idSurvey, request);
      expect(result).toEqual({
        idSurvey: 1,
        idUser: 1,
        arquivado: true,
      });
      expect(service.updateArquivar).toHaveBeenCalledWith(idSurvey, request.user.sub);
    });
  });
});
