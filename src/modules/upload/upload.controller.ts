import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDTO } from './upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: FileDTO, @Body('bucketName') bucketName: string) {
    const result = await this.uploadService.upload(file, bucketName);
    return result;
  }
}
