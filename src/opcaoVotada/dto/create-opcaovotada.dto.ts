import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOpcaoVotadaDto {
  @IsNumber()
  @IsNotEmpty()
  id_opcao: number;
  @IsNumber()
  @IsNotEmpty()
  id_voto: number;
}
