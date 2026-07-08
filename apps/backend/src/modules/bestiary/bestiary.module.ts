import { Module } from '@nestjs/common';
import { ImageModule } from '../image/image.module';
import { BestiaryController } from './bestiary.controller';
import { BestiaryService } from './bestiary.service';
import { BestiaryRepository } from './bestiary.repository';

@Module({
  imports: [ImageModule],
  controllers: [BestiaryController],
  providers: [BestiaryService, BestiaryRepository],
  exports: [BestiaryService, BestiaryRepository],
})
export class BestiaryModule {}
