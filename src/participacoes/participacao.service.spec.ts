import { Test, TestingModule } from '@nestjs/testing';
import { ParticipacaoService } from './participacao.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOpcaoVotadaDto } from '../opcaoVotada/dto/create-opcaovotada.dto';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';

//Defininco a costante do idSurvey e idUser para usar em todo o código
const idSurvey = 1;
const idUser = 1;

describe('ParticipacaoService', () => {
  let service: ParticipacaoService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipacaoService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
            $transaction: jest.fn(),
            participacao: {
              findUnique: jest.fn(),
              checkSurvey: jest.fn(),
              checkUser: jest.fn(),
              checkDuplicatedOptions: jest.fn(),
              checkOptions: jest.fn(),
              checkOptionsSurvey: jest.fn(),
              checkOptionsPerQuestion: jest.fn(),
              createOptionsVoted: jest.fn(),
              getPreviousHash: jest.fn(),
              generateHash: jest.fn(),
              createVote: jest.fn(),
              createParticipation: jest.fn(),
              create: jest.fn(),
              getById: jest.fn(),
            },
            pesquisa: {
              findUnique: jest.fn(),
            },
            opcao: {
              findMany: jest.fn(),
            },
            opcao_Votada: {
              createMany: jest.fn(),
            },
            voto: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ParticipacaoService>(ParticipacaoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('checkSurvey', () => {
    it('Aqui deve lançar NotFoundException se a pesquisa não for encontrada', async () => {
      // Arrange: configuração inicial do teste
      const date = new Date();
      // Mock do método findUnique do serviço Prisma para retornar null, simulando que a pesquisa não foi encontrada
      jest.spyOn(prismaService.pesquisa, 'findUnique').mockResolvedValue(null);

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkSurvey lança uma exceção NotFoundException
      await expect(service.checkSurvey(idSurvey, date, prismaService)).rejects.toThrow(NotFoundException);
      // Verifica se o método findUnique foi chamado com os parâmetros corretos
      expect(prismaService.pesquisa.findUnique).toHaveBeenCalledWith({
        where: { id: idSurvey },
        select: { dataTermino: true },
      });
    });

    it('Aqui deve lançar ForbiddenException se a pesquisa já foi encerrada', async () => {
      // Arrange: configuração inicial do teste
      const date = new Date('2024/07/16');
      const endDate = new Date('2024/07/15');
      // Mock do método findUnique do serviço Prisma para retornar uma pesquisa com data de término anterior à data atual
      jest.spyOn(prismaService.pesquisa, 'findUnique').mockResolvedValue({
        id: idSurvey,
        titulo: 'Teste',
        codigo: 'teste123',
        dataCriacao: new Date('2023/01/01'),
        dataTermino: endDate,
        ehPublico: true,
        descricao: 'testando',
        criador: 1,
        arquivado: false,
        URLimagem: null,
        ehVotacao: true,
      });

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkSurvey lança uma exceção ForbiddenException
      await expect(service.checkSurvey(idSurvey, date, prismaService)).rejects.toThrow(ForbiddenException);
      // Verifica se o método findUnique foi chamado com os parâmetros corretos
      expect(prismaService.pesquisa.findUnique).toHaveBeenCalledWith({
        where: { id: idSurvey },
        select: { dataTermino: true },
      });
    });

    it('Aqui não deve lançar exceção se a pesquisa ainda estiver aberta', async () => {
      // Arrange: configuração inicial do teste
      const date = new Date('2024/07/14');
      const endDate = new Date('2024/07/15');
      // Mock do método findUnique do serviço Prisma para retornar uma pesquisa com data de término posterior à data atual
      jest.spyOn(prismaService.pesquisa, 'findUnique').mockResolvedValue({
        id: idSurvey,
        titulo: 'Teste',
        codigo: 'teste123',
        dataCriacao: new Date('2023/01/01'),
        dataTermino: endDate,
        ehPublico: true,
        descricao: 'testando',
        criador: 1,
        arquivado: false,
        URLimagem: null,
        ehVotacao: true,
      });

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkSurvey não lança exceção
      await expect(service.checkSurvey(idSurvey, date, prismaService)).resolves.not.toThrow();
      // Verifica se o método findUnique foi chamado com os parâmetros corretos
      expect(prismaService.pesquisa.findUnique).toHaveBeenCalledWith({
        where: { id: idSurvey },
        select: { dataTermino: true },
      });
    });
  });

  describe('checkUser', () => {
    it('Aqui deve lançar ForbiddenException se o usuário ja votou na pesquisa', async () => {
      // Arrange: configuração inicial do teste
      // Mock do método findUnique do serviço Prisma para retornar uma participação existente
      jest.spyOn(prismaService.participacao, 'findUnique').mockResolvedValue({
        id: 1,
        pesquisa_id: idSurvey,
        usuario_id: idUser,
      });

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkUser lança uma exceção ForbiddenException
      await expect(service.checkUser(idUser, idSurvey, prismaService)).rejects.toThrow(ForbiddenException);
      // Verifica se o método findUnique foi chamado com os parâmetros corretos
      expect(prismaService.participacao.findUnique).toHaveBeenCalledWith({
        where: {
          participation: {
            usuario_id: idUser,
            pesquisa_id: idSurvey,
          },
        },
      });
    });

    it('Aqui não deve lançar exceção se o usuário não votou na pesquisa', async () => {
      // Arrange: configuração inicial do teste
      // Mock do método findUnique do serviço Prisma para retornar null, simulando que o usuário não votou na pesquisa
      jest.spyOn(prismaService.participacao, 'findUnique').mockResolvedValue(null);

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkUser não lança exceção
      await expect(service.checkUser(idUser, idSurvey, prismaService)).resolves.not.toThrow();
      // Verifica se o método findUnique foi chamado com os parâmetros corretos
      expect(prismaService.participacao.findUnique).toHaveBeenCalledWith({
        where: {
          participation: {
            usuario_id: idUser,
            pesquisa_id: idSurvey,
          },
        },
      });
    });
  });

  describe('checkDuplicatedOptions', () => {
    it('Aqui não deve lançar exceção se o usuário NÃO votou na mesma opção mais de uma vez', async () => {
      // Arrange: configuração inicial do teste
      const optionsVoted: CreateOpcaoVotadaDto[] = [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }];

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkDuplicatedOptions não lança exceção
      await expect(service.checkDuplicatedOptions(optionsVoted)).resolves.not.toThrow();
    });

    it('Aqui deve lançar o ForbiddenException se o usuário VOTOU na mesma opção mais de uma vez', async () => {
      // Arrange: configuração inicial do teste
      const optionsVoted1: CreateOpcaoVotadaDto[] = [{ idOption: 1 }, { idOption: 2 }, { idOption: 1 }];
      const optionsVoted2: CreateOpcaoVotadaDto[] = [{ idOption: 3 }, { idOption: 3 }, { idOption: 3 }];

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkDuplicatedOptions lança ForbiddenException para optionsVoted1
      await expect(service.checkDuplicatedOptions(optionsVoted1)).rejects.toThrow(ForbiddenException);
      // Verifica se a função checkDuplicatedOptions lança ForbiddenException para optionsVoted2
      await expect(service.checkDuplicatedOptions(optionsVoted2)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('checkOptions', () => {
    it('Aqui não deve lançar exceção pois as opções votada estão no banco', async () => {
      // Arrange: configuração inicial do teste
      const optionsVoted: CreateOpcaoVotadaDto[] = [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }];

      // Mockando a função findMany do prismaService para retornar opções válidas
      jest.spyOn(prismaService.opcao, 'findMany').mockResolvedValue([
        { id: 1, pergunta_id: 1, texto: 'Texto 1', quantVotos: 2 },
        { id: 2, pergunta_id: 1, texto: 'Texto 2', quantVotos: 6 },
        { id: 3, pergunta_id: 1, texto: 'Texto 3', quantVotos: 3 },
      ]);

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkOptions não lança exceção
      await expect(service.checkOptions(optionsVoted, prismaService)).resolves.not.toThrow();
      // Verifica se a função findMany foi chamada com os parâmetros corretos
      expect(prismaService.opcao.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2, 3] } },
      });
    });

    it('Aqui deve lançar NotFoundException se as opções votadas não estiverem no banco', async () => {
      // Arrange: configuração inicial do teste
      const optionsVoted: CreateOpcaoVotadaDto[] = [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }];

      // Mockando a função findMany do prismaService para retornar opções incompletas (faltando a opção 3)
      jest.spyOn(prismaService.opcao, 'findMany').mockResolvedValue([
        { id: 1, pergunta_id: 1, texto: 'Texto 1', quantVotos: 2 },
        { id: 2, pergunta_id: 1, texto: 'Texto 2', quantVotos: 6 },
      ]);

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkOptions lança NotFoundException
      await expect(service.checkOptions(optionsVoted, prismaService)).rejects.toThrow(NotFoundException);
      // Verifica se a função findMany foi chamada com os parâmetros corretos
      expect(prismaService.opcao.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2, 3] } },
      });
    });
  });

  describe('checkOptionsSurvey', () => {
    it('Aqui não deve lançar exceção se as opções votadas pertencem a pesquisa', async () => {
      // Arrange: configuração inicial do teste
      const optionsVoted: CreateOpcaoVotadaDto[] = [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }];

      // Mockando a função $queryRaw do prismaService para retornar opções válidas
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]);

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkOptionsSurvey não lança exceção
      await expect(service.checkOptionsSurvey(idSurvey, optionsVoted, prismaService)).resolves.not.toThrow();
    });

    it('Aqui deve lançar ForbiddenException se alguma opção votada não pertence a pesquisa', async () => {
      // Arrange: configuração inicial do teste
      const optionsVoted: CreateOpcaoVotadaDto[] = [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }, { idOption: 4 }];

      // Mockando a função $queryRaw do prismaService para retornar opções incompletas (faltando a opção 4)
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]);

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkOptionsSurvey lança ForbiddenException
      await expect(service.checkOptionsSurvey(idSurvey, optionsVoted, prismaService)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('checkOptionsPerQuestion', () => {
    it('Aqui todas as perguntas tem uma opção votada e não deve lançar exceção', async () => {
      // Arrange: configuração inicial do teste
      const optionsVoted: CreateOpcaoVotadaDto[] = [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }];

      // Mockando a função $queryRaw do prismaService para retornar opções válidas por pergunta
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue([
        { optionId: 1, questionId: 1 },
        { optionId: 2, questionId: 3 },
        { optionId: 3, questionId: 2 },
      ]);

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkOptionsPerQuestion não lança exceção
      await expect(service.checkOptionsPerQuestion(idSurvey, optionsVoted, prismaService)).resolves.not.toThrow();
    });

    it('Aqui deve lançar ForbiddenException pois tem pergunta sem opção votada', async () => {
      // Arrange: configuração inicial do teste
      const optionsVoted: CreateOpcaoVotadaDto[] = [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }];

      // Mockando a função $queryRaw do prismaService para retornar opções por pergunta, incluindo perguntas sem opções votadas
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue([
        { optionId: 1, questionId: 1 },
        { optionId: 2, questionId: 3 },
        { optionId: 3, questionId: 2 },
        { optionId: null, questionId: 4 }, // Mockando a questão 4 com a opção votada igual a null
        { optionId: 4, questionId: 5 }, // Mockando a questão 5 com uma opção votada que não existe
      ]);

      // Act & Assert: execução do teste e verificação do resultado
      // Verifica se a função checkOptionsPerQuestion lança ForbiddenException
      await expect(service.checkOptionsPerQuestion(idSurvey, optionsVoted, prismaService)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('createOptionsVoted', () => {
    it('Aqui deve criar opções votadas no banco de dados', async () => {
      // Arrange: configuração inicial do teste
      const optionsVoted: CreateOpcaoVotadaDto[] = [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }];
      const idVote = 1;

      // Mapeando as opções votadas para o formato esperado pelo banco de dados
      const optionsVotedMap = optionsVoted.map((option) => ({
        voto_id: idVote,
        opcao_id: option.idOption,
      }));

      // Mockando a função createMany do prismaService para simular a criação no banco de dados
      jest.spyOn(prismaService.opcao_Votada, 'createMany').mockResolvedValue({ count: optionsVotedMap.length });

      // Act: execução da função que estamos testando
      await service.createOptionsVoted(optionsVoted, idVote, prismaService);

      // Assert: verificação do resultado
      expect(prismaService.opcao_Votada.createMany).toHaveBeenCalledWith({
        data: optionsVotedMap,
      });
    });

    it('Aqui deve lançar uma exceção se a criação das opções votadas falhar no banco de dados', async () => {
      // Arrange: configuração inicial do teste
      const optionsVoted: CreateOpcaoVotadaDto[] = [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }];
      const idVote = 1;

      // Mapeando as opções votadas para o formato esperado pelo banco de dados
      const optionsVotedMap = optionsVoted.map((option) => ({
        voto_id: idVote,
        opcao_id: option.idOption,
      }));

      // Mockando a função createMany do prismaService para simular uma falha na criação no banco de dados
      jest.spyOn(prismaService.opcao_Votada, 'createMany').mockRejectedValue(new Error('Erro ao criar opções votadas'));

      // Act & Assert: execução da função e verificação do resultado
      await expect(service.createOptionsVoted(optionsVoted, idVote, prismaService)).rejects.toThrowError(
        'Erro ao criar opções votadas',
      );
      expect(prismaService.opcao_Votada.createMany).toHaveBeenCalledWith({ data: optionsVotedMap });
    });
  });

  describe('getPreviousHash', () => {
    it('Aqui deve retornar a hash com base no voto anterior', async () => {
      // Arrange: configuração inicial do teste
      const expectedHash = 'testHash';

      // Mockando a função $queryRaw do prismaService para retornar a hash esperada
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue([{ hash: expectedHash }]);

      // Act: execução da função que estamos testando
      const result = await service.getPreviousHash(idSurvey, prismaService);

      // Assert: verificação do resultado
      expect(result).toEqual(expectedHash);
    });

    it('Aqui deve criar um sal pois é a primeira hash', async () => {
      // Arrange: configuração inicial do teste

      // Mockando a função $queryRaw do prismaService para simular a ausência de hashes anteriores
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue([]);

      // Act: execução da função que estamos testando
      const result = await service.getPreviousHash(idSurvey, prismaService);

      // Assert: verificação do resultado
      expect(result).toHaveLength(64);
    });
  });

  describe('generateHash', () => {
    it('deve gerar a hash correta para dados fornecidos', async () => {
      // Arrange: configuração inicial do teste
      const previousHash = 'testHash01';
      const optionsVoted = [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }];
      const date = new Date('2024/07/18');

      // Mapeando as opções votadas para obter seus IDs
      const optionsVotedIDs = optionsVoted.map((option) => option.idOption);
      const dataVote = {
        previousHash,
        date,
        optionsVotedIDs,
      };

      // Gerando a hash esperada usando a biblioteca crypto
      const expectedHash = crypto.createHash('sha256').update(JSON.stringify(dataVote)).digest('hex');

      // Act: execução da função que estamos testando
      const result = await service.generateHash(previousHash, optionsVoted, date);

      // Assert: verificação do resultado
      expect(result).toBe(expectedHash);
    });

    it('Aqui deve gerar hashes diferentes para diferentes dados', async () => {
      // Arrange: configuração inicial do teste
      const previousHash01 = 'testHash01';
      const previousHash02 = 'testHash02';
      const optionsVoted1 = [{ idOption: 1 }, { idOption: 2 }];
      const optionsVoted2 = [{ idOption: 3 }, { idOption: 4 }];
      const date1 = new Date('2024/07/18');
      const date2 = new Date('2024/07/19');

      // Act: execução da função que estamos testando
      const hash1 = await service.generateHash(previousHash01, optionsVoted1, date1);
      const hash2 = await service.generateHash(previousHash02, optionsVoted2, date2);

      // Assert: verificação do resultado
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('createVote', () => {
    it('Aqui deve retornar um voto com sucesso', async () => {
      // Arrange: configuração inicial do teste
      const hashFake = 'testHash01';
      const dateVote = new Date('2024/07/18');

      // Mockando a função create do prismaService para simular a criação de um voto no banco de dados
      jest.spyOn(prismaService.voto, 'create').mockResolvedValue({ id: 1, data: dateVote, hash: hashFake });

      // Act: execução da função que estamos testando
      const result = await service.createVote(hashFake, dateVote, prismaService);

      // Assert: verificação do resultado
      expect(result).toEqual(1);
    });

    it('Aqui deve lançar uma exceção com erro no voto criado', async () => {
      // Arrange: configuração inicial do teste
      const hashFake = 'testHash01';
      const dateVote = new Date('2024/07/18');

      // Mockando a função create do prismaService para simular um erro na criação do voto no banco de dados
      jest.spyOn(prismaService.voto, 'create').mockRejectedValue(new Error('Error ao criar o voto'));

      // Assert: verificação do resultado
      expect(service.createVote(hashFake, dateVote, prismaService)).rejects.toThrowError('Error ao criar o voto');
    });
  });

  describe('createParticipation', () => {
    it('Aqui deve criar uma participação com sucesso', async () => {
      // Act: execução da função que estamos testando
      await service.createParticipation(idUser, idSurvey, prismaService);

      // Assert: verificação do resultado
      expect(prismaService.participacao.create).toHaveBeenCalledWith({
        data: {
          pesquisa_id: idSurvey,
          usuario_id: idUser,
        },
      });
    });

    it('Aqui deve lançar uma exceção ao criar uma participação inválida', async () => {
      // Arrange: configuração inicial do teste
      // Mockando a função create do prismaService para simular um erro na criação da participação
      jest.spyOn(prismaService.participacao, 'create').mockImplementation(() => {
        throw new Error('Error ao criar participação');
      });

      // Assert: verificação do resultado
      expect(service.createParticipation(idUser, idSurvey, prismaService)).rejects.toThrowError(
        'Error ao criar participação',
      );
      expect(prismaService.participacao.create).toHaveBeenCalledWith({
        data: {
          pesquisa_id: idSurvey,
          usuario_id: idUser,
        },
      });
    });
  });

  describe('create', () => {
    it('Aqui deve criar o voto e retornar a hash', async () => {
      // Arrange: configuração inicial do teste
      const createParticipacaoDto: CreateParticipacaoDto = {
        voto: {
          opcoesVotadas: [{ idOption: 1 }, { idOption: 2 }],
        },
      };
      const previousHash = 'Hash prevista';
      const testHash = 'Hash teste';
      const idVote = 123;

      // Mock para a transação
      jest.spyOn(prismaService, '$transaction').mockImplementation(async (callback) => {
        // Chama o callback com prismaService e retorna o valor esperado
        return await callback(prismaService);
      });

      jest.spyOn(service, 'checkSurvey').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'checkUser').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'checkOptions').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'checkDuplicatedOptions').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'checkOptionsSurvey').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'checkOptionsPerQuestion').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'createParticipation').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'getPreviousHash').mockResolvedValueOnce(previousHash);
      jest.spyOn(service, 'generateHash').mockResolvedValueOnce(testHash);
      jest.spyOn(service, 'createVote').mockResolvedValueOnce(idVote);
      jest.spyOn(service, 'createOptionsVoted').mockResolvedValueOnce(undefined);

      // Act
      const result = await service.create(createParticipacaoDto, idUser, idSurvey);

      // Assert: verifica se o valor esperado confere
      expect(result).toBe(testHash);
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('Aqui deve lançar uma exceção de conflito se houver um erro conhecido do Prisma', async () => {
      // Arrange: configuração inicial do teste
      const createParticipacaoDto = {
        voto: {
          opcoesVotadas: [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }],
        },
      };
      const prismaError = new Prisma.PrismaClientKnownRequestError('Error', { code: 'P2002', clientVersion: '2.0' });

      // Mockando a função $transaction do prismaService para simular um erro conhecido do Prisma
      jest.spyOn(prismaService, '$transaction').mockImplementation(async () => {
        throw prismaError;
      });

      // Act & Assert: execução da função e verificação do resultado
      await expect(service.create(createParticipacaoDto, idUser, idSurvey)).rejects.toThrow(HttpException);
      await expect(service.create(createParticipacaoDto, idUser, idSurvey)).rejects.toThrow(
        expect.objectContaining({
          message: prismaError.message,
          status: HttpStatus.CONFLICT,
        }),
      );
    });

    it('Aqui deve lançar uma exceção de ForbiddenException', async () => {
      // Arrange: configuração inicial do teste
      const createParticipacaoDto = {
        voto: {
          opcoesVotadas: [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }],
        },
      };

      // Mockando a função $transaction do prismaService para simular uma ForbiddenException
      jest.spyOn(prismaService, '$transaction').mockImplementation(async () => {
        throw new ForbiddenException();
      });

      // Act & Assert: execução da função e verificação do resultado
      await expect(service.create(createParticipacaoDto, idUser, idSurvey)).rejects.toThrow(ForbiddenException);
    });

    it('Aqui deve lançar uma exceção de NotFoundException', async () => {
      // Arrange: configuração inicial do teste
      const createParticipacaoDto = {
        voto: {
          opcoesVotadas: [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }],
        },
      };

      // Mockando a função $transaction do prismaService para simular uma NotFoundException
      jest.spyOn(prismaService, '$transaction').mockImplementation(async () => {
        throw new NotFoundException();
      });

      // Act & Assert: execução da função e verificação do resultado
      await expect(service.create(createParticipacaoDto, idUser, idSurvey)).rejects.toThrow(NotFoundException);
    });

    it('Aqui deve lançar uma exceção de erro interno se ocorrer um erro inesperado', async () => {
      // Arrange: configuração inicial do teste
      const createParticipacaoDto = {
        voto: {
          opcoesVotadas: [{ idOption: 1 }, { idOption: 2 }, { idOption: 3 }],
        },
      };

      // Mockando a função $transaction do prismaService para simular um erro inesperado
      jest.spyOn(prismaService, '$transaction').mockImplementation(async () => {
        throw new Error('Error inesperado');
      });

      // Act & Assert: execução da função e verificação do resultado
      await expect(service.create(createParticipacaoDto, idUser, idSurvey)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.create(createParticipacaoDto, idUser, idSurvey)).rejects.toThrow(
        expect.objectContaining({
          message: 'Erro interno ao criar uma participação',
        }),
      );
    });
  });
  describe('getById', () => {
    it('Aqui deve retornar a participação se encontrada', async () => {
      // Arrange: configuração inicial do teste
      const participacao = { id: 1, usuario_id: 1, pesquisa_id: 1 };

      // Mockando a função findUnique do prismaService para simular a busca de uma participação no banco de dados
      jest.spyOn(prismaService.participacao, 'findUnique').mockResolvedValue(participacao);

      // Act: execução da função ta sendo testada
      const result = await service.getById(1);

      // Assert: verificação do resultado
      expect(result).toEqual(participacao);
      expect(prismaService.participacao.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve retornar null se a participação não for encontrada', async () => {
      // Arrange: configuração inicial do teste
      jest.spyOn(prismaService.participacao, 'findUnique').mockResolvedValue(null);

      // Act: execução da função que ta sendo testada
      const result = await service.getById(1);

      // Assert: verificação do resultado
      expect(result).toBeNull();
      expect(prismaService.participacao.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
