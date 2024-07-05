import { PesquisaController } from './pesquisa.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { PesquisaService } from './pesquisa.service';

describe('PesquisaController', () => {
  let controller: PesquisaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PesquisaController],
      providers: [PesquisaService],
    }).compile();

    controller = module.get<PesquisaController>(PesquisaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
