import { OmitType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends OmitType(CreateUsuarioDto, ['senha', 'URLimagem', 'cpf']) {}
