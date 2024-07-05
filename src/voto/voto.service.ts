import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VotoService {
  constructor(private readonly prismaService: PrismaService) {}

  findOne(id: number): string {
    return `Aqui retorna o voto com o id ${id.toString}`;
  }
}
