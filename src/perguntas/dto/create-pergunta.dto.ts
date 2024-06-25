import { IsInt, IsOptional, IsString } from 'class-validator';
import { CreateOpcaoDto } from 'src/opcao/dto/create-opcao.dto';

export class CreatePerguntaDto {
  @IsString()
  texto: string;

  @IsOptional()
  @IsString()
  URLimagem?: string;

  @IsInt()
  pesquisa_id: number;

  opcoes: CreateOpcaoDto[];
}
