import { Test, TestingModule } from '@nestjs/testing';
import { ParticipacaoService } from './participacao.service';

describe('ParticipacaoService', () => {
  let provider: ParticipacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipacaoService],
    }).compile();

    provider = module.get<ParticipacaoService>(ParticipacaoService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
