import { PartialType } from '@nestjs/mapped-types';
import { CreatePerguntaDto } from './create-pergunta.dto';

export class UpdatePerguntaDto extends PartialType(CreatePerguntaDto) {}
