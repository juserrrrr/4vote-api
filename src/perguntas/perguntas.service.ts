import { Injectable } from '@nestjs/common';
import { CreatePerguntaDto } from './dto/create-pergunta.dto';
import { UpdatePerguntaDto } from './dto/update-pergunta.dto';

@Injectable()
export class PerguntasService {
  create(createPerguntaDto: CreatePerguntaDto) {
    return 'This action adds a new pergunta';
  }

  findAll() {
    return `This action returns all perguntas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pergunta`;
  }

  update(id: number, updatePerguntaDto: UpdatePerguntaDto) {
    return `This action updates a #${id} pergunta`;
  }

  remove(id: number) {
    return `This action removes a #${id} pergunta`;
  }
}
