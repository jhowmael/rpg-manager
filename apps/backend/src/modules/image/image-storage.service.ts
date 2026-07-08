import { BadRequestException, Injectable } from '@nestjs/common';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

@Injectable()
export class ImageStorageService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  async save(file: Express.Multer.File): Promise<{ id: string; url: string }> {
    if (!file) {
      throw new BadRequestException('Arquivo de imagem é obrigatório');
    }

    const extension = ALLOWED_MIME_TYPES[file.mimetype];
    if (!extension) {
      throw new BadRequestException('Formato inválido. Use JPG, PNG, GIF ou WebP.');
    }

    if (file.size > MAX_IMAGE_BYTES) {
      throw new BadRequestException('Imagem muito grande. Máximo de 2 MB.');
    }

    const id = `${randomUUID()}${extension}`;
    await mkdir(this.uploadDir, { recursive: true });
    await writeFile(join(this.uploadDir, id), file.buffer);

    return {
      id,
      url: `/uploads/${id}`,
    };
  }

  async delete(imageId: string): Promise<void> {
    if (!imageId || imageId.includes('..') || imageId.includes('/')) {
      return;
    }

    try {
      await unlink(join(this.uploadDir, imageId));
    } catch {
      // Arquivo já removido ou inexistente
    }
  }
}
