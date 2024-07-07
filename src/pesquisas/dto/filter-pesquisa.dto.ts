import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class filterPesquisaDto {
  @IsBoolean({ message: 'O campo arquivada deve ser um booleano.' })
  @Transform(({ value }) => value === 'true')
  @IsOptional({ message: 'O campo arquivada é opcional.' })
  arquivada?: boolean;

  @IsBoolean({ message: 'O campo participo deve ser um booleano.' })
  @Transform(({ value }) => value === 'true')
  @IsOptional({ message: 'O campo participo é opcional.' })
  participo?: boolean;

  @IsBoolean({ message: 'O campo criador deve ser um booleano.' })
  @Transform(({ value }) => value === 'true')
  @IsOptional({ message: 'O campo criador é opcional.' })
  criador?: boolean;

  @IsBoolean({ message: 'O campo encerradas deve ser um booleano.' })
  @Transform(({ value }) => value === 'true')
  @IsOptional({ message: 'O campo encerradas é opcional.' })
  encerradas?: boolean;
}
