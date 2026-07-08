import { Module } from '@nestjs/common';
import { SideQuestController } from './side-quest.controller';
import { SideQuestService } from './side-quest.service';
import { SideQuestRepository } from './side-quest.repository';

@Module({
  controllers: [SideQuestController],
  providers: [SideQuestService, SideQuestRepository],
  exports: [SideQuestService, SideQuestRepository],
})
export class SideQuestModule {}
