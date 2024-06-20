import { Controller, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tagService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
