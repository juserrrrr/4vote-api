import { PartialType } from '@nestjs/mapped-types';
import { CreateOpcaoVotadaDto } from './create-opcaovotada.dto';

export class UpdateOpcaoVotadaDto extends PartialType(CreateOpcaoVotadaDto) {}
