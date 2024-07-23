import { Injectable } from '@nestjs/common';
import { FileDTO } from './upload.dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  private supabaseURL = process.env.SUPERBASE_URL;
  private supabaseKEY = process.env.SUPERBASE_KEY;
  private supabase = createClient(this.supabaseURL, this.supabaseKEY, {
    auth: { persistSession: false },
  });

  async upload(file: FileDTO) {
    const bucketName = 'Files4vote';
    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .upload(file.originalname, file.buffer, { upsert: true });

    if (error) {
      throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
    }
    const urlData = this.supabase.storage.from(bucketName).getPublicUrl(file.originalname);

    return {
      ...data,
      url: urlData.data.publicUrl,
    };
  }
}
