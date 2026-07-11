import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Image } from '@prisma/client';
import { ImageRepository } from './image.repository';
import { validateImageFile } from './image.constants';
import { ImageUploadResponseDto } from './dto/image-upload-response.dto';

@Injectable()
export class ImageService {
  constructor(private readonly repository: ImageRepository) {}

  async upload(file: Express.Multer.File): Promise<ImageUploadResponseDto> {
    try {
      validateImageFile(file);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Arquivo inválido',
      );
    }

    const image = await this.repository.create(
      file.buffer,
      file.mimetype,
      file.size,
    );

    return {
      id: image.id,
      url: `/image/${image.id}`,
    };
  }

  async findById(id: string): Promise<Image> {
    const image = await this.repository.findById(id);
    if (!image) {
      throw new NotFoundException('Imagem não encontrada');
    }
    return image;
  }

  async delete(imageId?: string | null): Promise<void> {
    if (!imageId) return;
    await this.repository.delete(imageId);
  }
}
