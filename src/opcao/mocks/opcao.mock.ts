import { CreateOpcaoDto } from '../dto/create-opcao.dto';

export const opcaoMock: CreateOpcaoDto & { id: number } = {
  id: 1,
  texto: 'Texto Opcao Mock',
};
