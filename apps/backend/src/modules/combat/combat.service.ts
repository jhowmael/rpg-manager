import { Injectable } from '@nestjs/common';
import { CombatRepository } from './combat.repository';

@Injectable()
export class CombatService {
  constructor(private readonly combatRepository: CombatRepository) {}
}
