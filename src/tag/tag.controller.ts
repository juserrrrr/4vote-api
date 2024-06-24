import { Controller, Get, Post, Body } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }
}
