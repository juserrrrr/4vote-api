import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOpcaoVotadaDto {
  @IsNumber()
  @IsNotEmpty({ message: 'O id não pode ser vazio' })
  idOption: number;
}
