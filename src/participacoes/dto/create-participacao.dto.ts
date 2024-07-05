import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateOpcaoVotadaDto } from 'src/opcaovotada/dto/create-opcaovotada.dto';
import { CreateVotoDto } from 'src/voto/dto/create-voto.dto';

export class CreateParticipacaoDto {
  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @IsInt()
  @IsNotEmpty()
  pesquisa_id: number;

  voto: CreateVotoDto;

  opcoesVotadas: CreateOpcaoVotadaDto[];
}
