import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatepartipacaoDto {
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  usuario_id?: number;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  pesquisa_id?: number;
}

export class UpdateParticipacaoDto extends PartialType(CreatepartipacaoDto) {}
