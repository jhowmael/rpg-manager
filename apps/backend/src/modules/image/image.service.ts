import { Injectable } from '@nestjs/common';
import { ImageStorageService } from './image-storage.service';
import { ImageUploadResponseDto } from './dto/image-upload-response.dto';

@Injectable()
export class ImageService {
  constructor(private readonly storage: ImageStorageService) {}

  async upload(file: Express.Multer.File): Promise<ImageUploadResponseDto> {
    return this.storage.save(file);
  }

  async delete(imageId?: string | null): Promise<void> {
    if (imageId) {
      await this.storage.delete(imageId);
    }
  }
}
