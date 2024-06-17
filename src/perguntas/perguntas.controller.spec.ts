import { Test, TestingModule } from '@nestjs/testing';
import { PerguntasController } from './perguntas.controller';
import { PerguntasService } from './perguntas.service';

describe('PerguntasController', () => {
  let controller: PerguntasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerguntasController],
      providers: [PerguntasService],
    }).compile();

    controller = module.get<PerguntasController>(PerguntasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
