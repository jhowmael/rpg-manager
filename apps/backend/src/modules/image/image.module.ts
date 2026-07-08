import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ImageStorageService } from './image-storage.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService, ImageStorageService],
  exports: [ImageService],
})
export class ImageModule {}
