import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class filterPesquisaDto {
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
    return value;
  })
  @IsBoolean({ message: 'O campo arquivada deve ser um booleano.' })
  @IsOptional({ message: 'O campo arquivada é opcional.' })
  arquivada?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
    return value;
  })
  @IsBoolean({ message: 'O campo participo deve ser um booleano.' })
  @IsOptional({ message: 'O campo participo é opcional.' })
  participo?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
    return value;
  })
  @IsBoolean({ message: 'O campo criador deve ser um booleano.' })
  @IsOptional({ message: 'O campo criador é opcional.' })
  criador?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
    return value;
  })
  @IsBoolean({ message: 'O campo encerradas deve ser um booleano.' })
  @IsOptional({ message: 'O campo encerradas é opcional.' })
  encerradas?: boolean;
}
