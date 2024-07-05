import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOpcaoVotadaDto {
  @IsNumber()
  @IsNotEmpty({ message: 'O id não pode ser vazio' })
  id_opcao: number;
}
