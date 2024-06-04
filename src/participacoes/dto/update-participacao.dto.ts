import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateParticipacaoDto {
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  usuario_id?: number;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  pesquisa_id?: number;
}
