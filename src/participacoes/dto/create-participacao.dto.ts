import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateOpcaoVotadaDto } from 'src/opcaovotada/dto/create-opcaovotada.dto';
import { CreateVotoDto } from 'src/voto/dto/create-voto.dto';

export class CreateParticipacaoDto {
  @IsNotEmpty()
  @ValidateNested({ each: true, message: 'Cada voto deve ser válido.' })
  @Type(() => CreateVotoDto)
  voto: CreateVotoDto;

  @IsArray({ message: 'opcoesVotadas deve ser um array.' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos uma opcaoVotada.' })
  @ValidateNested({ each: true, message: 'Cada opcaoVotada deve ser válida.' })
  @Type(() => CreateOpcaoVotadaDto)
  opcoesVotadas: CreateOpcaoVotadaDto[];
}
