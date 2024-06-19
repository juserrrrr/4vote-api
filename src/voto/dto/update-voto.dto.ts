import { PartialType } from '@nestjs/mapped-types';
import { CreateVotoDto } from './create-voto.dto';

export class UpdateVotoDto extends PartialType(CreateVotoDto) {}
