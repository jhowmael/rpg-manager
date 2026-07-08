import type { Combat, CombatFighter, FighterStatus } from '../types/combat';

export function getFighterStatus(fighter: CombatFighter): FighterStatus {
  if (fighter.status) return fighter.status;
  return fighter.vidaAtual <= 0 ? 'dead' : 'active';
}

export function isFighterInBattle(fighter: CombatFighter): boolean {
  return getFighterStatus(fighter) === 'active' && fighter.vidaAtual > 0;
}

export const FIGHTER_STATUS_LABELS: Record<FighterStatus, string> = {
  active: 'Em combate',
  dead: 'Morto',
  fled: 'Fugiu',
};

export const FIGHTER_STATUS_STYLES: Record<FighterStatus, string> = {
  active: 'border-rpg-forest/50 bg-rpg-forest/10 text-rpg-forest',
  dead: 'border-rpg-hp/50 bg-rpg-hp/10 text-rpg-hp',
  fled: 'border-rpg-gold-dark/50 bg-rpg-gold/10 text-rpg-gold-dark',
};

export function sortFightersByInitiative(fighters: CombatFighter[]): CombatFighter[] {
  return [...fighters]
    .sort((a, b) => {
      const diff = (b.iniciativa ?? 0) - (a.iniciativa ?? 0);
      if (diff !== 0) return diff;
      return a.nome.localeCompare(b.nome, 'pt-BR');
    })
    .map((fighter, index) => ({ ...fighter, ordemVez: index + 1 }));
}

export function getOrderedFighters(fighters: CombatFighter[]): CombatFighter[] {
  return [...fighters].sort((a, b) => a.ordemVez - b.ordemVez);
}

export function advanceTurn(combat: Combat): Combat {
  const ordered = getOrderedFighters(combat.fighters);
  const activeIndices = ordered
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => isFighterInBattle(f));

  if (activeIndices.length === 0) {
    return {
      ...combat,
      fase: 'finished',
      turno_iniciado_em: null,
      encerrado_em: combat.encerrado_em ?? new Date().toISOString(),
    };
  }

  const currentPos = activeIndices.findIndex(({ i }) => i === combat.turno_atual_index);
  const nextPos = currentPos === -1 ? 0 : (currentPos + 1) % activeIndices.length;
  const wrapped = currentPos !== -1 && nextPos === 0;
  const nextIndex = activeIndices[nextPos].i;

  return {
    ...combat,
    rodada_atual: wrapped ? combat.rodada_atual + 1 : combat.rodada_atual,
    turno_atual_index: nextIndex,
    turno_iniciado_em: Date.now(),
  };
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function updateFighter(
  combat: Combat,
  fighterId: string,
  patch: Partial<CombatFighter>,
): Combat {
  return {
    ...combat,
    fighters: combat.fighters.map(f => (f.id === fighterId ? { ...f, ...patch } : f)),
  };
}

export function formatCombatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
