import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateVotoDto } from '../../voto/dto/create-voto.dto';

export class CreateParticipacaoDto {
  @IsNotEmpty()
  @ValidateNested({ each: true, message: 'Cada voto deve ser válido.' })
  @Type(() => CreateVotoDto)
  voto: CreateVotoDto;
}
