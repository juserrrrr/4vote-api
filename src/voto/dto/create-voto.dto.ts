import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateOpcaoVotadaDto } from '../../opcaoVotada/dto/create-opcaovotada.dto';

export class CreateVotoDto {
  @IsArray({ message: 'opcoesVotadas deve ser um array.' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos uma opcaoVotada.' })
  @ValidateNested({ each: true, message: 'Cada opcaoVotada deve ser válida.' })
  @Type(() => CreateOpcaoVotadaDto)
  opcoesVotadas: CreateOpcaoVotadaDto[];
}
