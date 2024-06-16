import { PartialType } from '@nestjs/mapped-types';
import { CreateTagPesquisaDto } from './create-tagpesquisa.dto';

export class UpdateTagPesquisaDto extends PartialType(CreateTagPesquisaDto) {}
