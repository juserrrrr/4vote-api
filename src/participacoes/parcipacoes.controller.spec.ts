import { Test, TestingModule } from '@nestjs/testing';
import { ParcipacoesController } from './participacoes.controller';
import { ParticipacaoService } from './participacao.service';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import { CreateOpcaoVotadaDto } from '../opcaoVotada/dto/create-opcaovotada.dto';
import { CreateVotoDto } from '../voto/dto/create-voto.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Definindo constante para usar nos testes
const bodyOpçãoVotada: CreateOpcaoVotadaDto[] = [{ idOption: 1 }];
const bodyVoto: CreateVotoDto = { opcoesVotadas: bodyOpçãoVotada };
const bodyParticipacao: CreateParticipacaoDto = { voto: bodyVoto };
const idUser = 123;
const idSurvey = 456;
const req = { user: { sub: idUser } };

describe('ParcipacoesController', () => {
  let controller: ParcipacoesController;
  let service: ParticipacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParcipacoesController],
      providers: [
        {
          provide: ParticipacaoService,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ParcipacoesController>(ParcipacoesController);
    service = module.get<ParticipacaoService>(ParticipacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Aqui deve retornar uma participação com sucesso', async () => {
      // Arrange: define o valor esperado para o resultado da função
      const expectedResult = 'hash';

      // Cria um mock da função 'create' do serviço para retornar o valor esperado
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      // Act: chama a função 'create' do controlador
      const result = await controller.create(req, idSurvey, bodyParticipacao);

      // Assert: verifica se o resultado é o esperado e se a função 'create' foi chamada corretamente
      expect(result).toEqual(expectedResult);
      // Confirma que o resultado é uma string
      expect(typeof result).toEqual('string');
      // Verifica se a função 'create' foi chamada
      expect(service.create).toHaveBeenCalled();
      // Verifica os parâmetros com os quais 'create' foi chamada
      expect(service.create).toHaveBeenLastCalledWith(bodyParticipacao, idUser, idSurvey);
    });

    it('Aqui deve retornar uma exceção', async () => {
      // Arrange: configura o mock da função 'create' para lançar uma exceção
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new HttpException('Error de criar participação', HttpStatus.BAD_REQUEST));

      // Act & Assert: chama a função 'create' do controlador e verifica se a exceção é lançada corretamente
      await expect(controller.create(req, idSurvey, bodyParticipacao)).rejects.toThrow(HttpException);
      // Verifica os parâmetros com os quais 'create' foi chamada
      expect(service.create).toHaveBeenCalledWith(bodyParticipacao, idUser, idSurvey);
      // Verifica se a exceção lançada contém a mensagem esperada
      expect(() => controller.create(req, idSurvey, bodyParticipacao)).rejects.toThrowError(
        'Error de criar participação',
      );
    });
  });

  describe('getById', () => {
    it('Aqui deve retornar um id com sucesso', async () => {
      // Arrange: define o valor esperado para o resultado da função
      const expectedResult = { id: 1, pesquisa_id: 2, usuario_id: 5 };

      // Cria um mock da função 'getById' do serviço para retornar o valor esperado
      jest.spyOn(service, 'getById').mockResolvedValue(expectedResult);

      // Act: chama a função 'getById' do controlador
      const result = await controller.getById(1);

      // Assert: Verifica se o resultado é o esperado
      expect(result).toEqual(expectedResult);
      // Verifica se a função 'getById' foi chamada com o ID correto
      expect(service.getById).toHaveBeenCalledWith(1);
    });

    it('Aqui deve retornar uma exceção', async () => {
      // Arrange: configura o mock da função 'getById' para lançar uma exceção
      jest
        .spyOn(service, 'getById')
        .mockRejectedValue(new HttpException('Error ao procurar um id', HttpStatus.NOT_FOUND));

      // Act & Assert: chama a função 'getById' do controlador e verifica se a exceção é lançada corretamente
      await expect(controller.getById(1)).rejects.toThrow(HttpException);
      // Verifica se a função 'getById' foi chamada com o ID correto
      expect(service.getById).toHaveBeenCalledWith(1);
    });
  });
});
