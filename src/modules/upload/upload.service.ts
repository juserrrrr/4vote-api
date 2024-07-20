import { Injectable } from '@nestjs/common';
import { FileDTO } from './upload.dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  private supabaseURL = 'https://nydqbchcfgkevfdmbifx.supabase.co';
  private supabaseKEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZHFiY2hjZmdrZXZmZG1iaWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NjE0MDksImV4cCI6MjAzNjAzNzQwOX0.BJzPGLiJcIotjfUjXRONQMjQFKLMKvCwc1MaYMTJBIM';
  private supabase = createClient(this.supabaseURL, this.supabaseKEY, {
    auth: { persistSession: false },
  });

  async upload(file: FileDTO, bucketName: string) {
    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .upload(file.originalname, file.buffer, { upsert: true });

    if (error) {
      throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
    }

    return data;
  }
}
