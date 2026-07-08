import { Module } from '@nestjs/common';
import { CombatController } from './combat.controller';
import { CombatService } from './combat.service';
import { CombatRepository } from './combat.repository';

@Module({
  controllers: [CombatController],
  providers: [CombatService, CombatRepository],
  exports: [CombatService, CombatRepository],
})
export class CombatModule {}
