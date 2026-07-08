import { Module } from '@nestjs/common';
import { MainStoryController } from './main-story.controller';
import { MainStoryService } from './main-story.service';
import { MainStoryRepository } from './main-story.repository';

@Module({
  controllers: [MainStoryController],
  providers: [MainStoryService, MainStoryRepository],
  exports: [MainStoryService, MainStoryRepository],
})
export class MainStoryModule {}
