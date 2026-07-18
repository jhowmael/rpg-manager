import type { Combat, CombatFighter, FighterStatus } from '../types/combat';

export function getFighterStatus(fighter: CombatFighter): FighterStatus {
  return fighter.status ?? 'active';
}

export function isFighterInBattle(fighter: CombatFighter): boolean {
  return getFighterStatus(fighter) === 'active';
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
  return resolveInitiativeOrder(fighters).map((fighter, index) => ({
    ...fighter,
    ordemVez: index + 1,
  }));
}

/** Entrada ordenável: keys[0] = iniciativa base; keys seguintes = rodadas de desempate. */
export interface InitiativeOrderEntry {
  fighterId: string;
  keys: number[];
}

function compareInitiativeKeys(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const diff = (b[i] ?? 0) - (a[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function buildInitiativeOrderEntries(fighters: CombatFighter[]): InitiativeOrderEntry[] {
  return [...fighters]
    .map(f => ({
      fighterId: f.id,
      keys: [f.iniciativa ?? 0],
    }))
    .sort((a, b) => compareInitiativeKeys(a.keys, b.keys));
}

/** Grupos consecutivos ainda empatados (mesmo conjunto de keys). */
export function findInitiativeTieGroups(entries: InitiativeOrderEntry[]): InitiativeOrderEntry[][] {
  if (entries.length === 0) return [];

  const groups: InitiativeOrderEntry[][] = [];
  let current: InitiativeOrderEntry[] = [entries[0]];

  for (let i = 1; i < entries.length; i++) {
    const entry = entries[i];
    if (compareInitiativeKeys(current[0].keys, entry.keys) === 0) {
      current.push(entry);
    } else {
      groups.push(current);
      current = [entry];
    }
  }
  groups.push(current);
  return groups;
}

export function getTiedFighterIds(entries: InitiativeOrderEntry[]): string[] {
  return findInitiativeTieGroups(entries)
    .filter(group => group.length > 1)
    .flatMap(group => group.map(e => e.fighterId));
}

/**
 * Aplica uma rodada de desempate só dentro dos grupos empatados.
 * Quem não empatou mantém a posição relativa (não “desce” na ordem).
 */
export function applyInitiativeTiebreak(
  entries: InitiativeOrderEntry[],
  rolls: Record<string, number>,
): InitiativeOrderEntry[] {
  return findInitiativeTieGroups(entries).flatMap(group => {
    if (group.length === 1) return group;

    return [...group]
      .map(entry => ({
        ...entry,
        keys: [...entry.keys, rolls[entry.fighterId] ?? 0],
      }))
      .sort((a, b) => compareInitiativeKeys(a.keys, b.keys));
  });
}

export function resolveInitiativeOrder(
  fighters: CombatFighter[],
  entries?: InitiativeOrderEntry[],
): CombatFighter[] {
  const byId = new Map(fighters.map(f => [f.id, f]));
  const orderedEntries = entries ?? buildInitiativeOrderEntries(fighters);

  return orderedEntries
    .map(entry => byId.get(entry.fighterId))
    .filter((f): f is CombatFighter => Boolean(f));
}

export function assignOrdemVez(fighters: CombatFighter[]): CombatFighter[] {
  return fighters.map((fighter, index) => ({ ...fighter, ordemVez: index + 1 }));
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
