import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(OmitType(CreateUsuarioDto, ['senha', 'URLimagem', 'cpf'])) {}
