import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateParticipacaoDto {
  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  pesquisa_id: number;
}
