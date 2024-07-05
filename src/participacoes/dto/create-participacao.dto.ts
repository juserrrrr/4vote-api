import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateVotoDto } from 'src/voto/dto/create-voto.dto';

export class CreateParticipacaoDto {
  @IsNotEmpty()
  @ValidateNested({ each: true, message: 'Cada voto deve ser válido.' })
  @Type(() => CreateVotoDto)
  voto: CreateVotoDto;

  // @IsArray({ message: 'opcoesVotadas deve ser um array.' })
  // @ArrayMinSize(1, { message: 'Deve haver pelo menos uma opcaoVotada.' })
  // @ValidateNested({ each: true, message: 'Cada opcaoVotada deve ser válida.' })
  // @Type(() => CreateOpcaoVotadaDto)
  // opcoesVotadas: CreateOpcaoVotadaDto[];
}
