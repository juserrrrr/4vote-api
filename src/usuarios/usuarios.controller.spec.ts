import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        UsuariosService,
        {
          provide: UsuariosService,
          useValue: { findMe: jest.fn().mockResolvedValue('user1') },
        },
        {
          provide: JwtService,
          useValue: JwtService,
        },
        AuthGuard,
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMe', () => {
    it('should return a user', async () => {
      const result = await controller.findMe({ user: { sub: 1 } });
      expect(result).toEqual('user1');
      expect(service.findMe).toHaveBeenCalledWith(1);
    });
  });
});
