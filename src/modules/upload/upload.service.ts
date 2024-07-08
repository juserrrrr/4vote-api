import { Injectable } from '@nestjs/common';
import { FileDTO } from './upload.dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  async upload(file: FileDTO) {
    const supabaseURL = 'https://nydqbchcfgkevfdmbifx.supabase.co';
    const supabaseKEY =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZHFiY2hjZmdrZXZmZG1iaWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NjE0MDksImV4cCI6MjAzNjAzNzQwOX0.BJzPGLiJcIotjfUjXRONQMjQFKLMKvCwc1MaYMTJBIM';

    const supabase = createClient(supabaseURL, supabaseKEY, {
      auth: {
        persistSession: false,
      },
    });

    const data = await supabase.storage.from('Files4vote').upload(file.originalname, file.buffer, {
      upsert: true,
    });

    return data;
  }
}
