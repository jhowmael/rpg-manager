import type { CharacterType } from '../types/character';

const NPC_STYLE = 'adventurer';
const MOB_STYLE = 'bottts-neutral';

/** Avatar mockado via DiceBear (seed estável por personagem). */
export function getMockCharacterImage(seed: string, tipo: CharacterType): string {
  const style = tipo === 'NPC' ? NPC_STYLE : MOB_STYLE;
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

/** Gera um novo seed para trocar a imagem mockada. */
export function rollMockImageSeed(baseId: string): string {
  return `${baseId}-${Date.now()}`;
}
