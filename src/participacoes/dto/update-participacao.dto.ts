import { PartialType } from '@nestjs/mapped-types';
import { CreateParticipacaoDto } from './create-participacao.dto';

export class UpdateParticipacaoDto extends PartialType(CreateParticipacaoDto) {}
