import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VotoService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number) {
    return await this.prisma.voto.findUnique({
      where: {
        id: id,
      },
    });
  }
}
