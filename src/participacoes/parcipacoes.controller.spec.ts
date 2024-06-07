import { Test, TestingModule } from '@nestjs/testing';
import { ParcipacoesController } from './participacoes.controller';

describe('ParcipacoesController', () => {
  let controller: ParcipacoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParcipacoesController],
    }).compile();

    controller = module.get<ParcipacoesController>(ParcipacoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
