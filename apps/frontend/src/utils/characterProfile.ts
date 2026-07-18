import type { Character } from '../types/character';

export function normalizePersonality(value: string | string[] | undefined | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

interface CharacterMetaItem {
  label: string;
  value?: string;
}

export function getCharacterMetaItems(character: Character): CharacterMetaItem[] {
  return [
    { label: 'Raça', value: character.raca },
    { label: 'Classe', value: character.classe },
    {
      label: 'Vida',
      value: character.vida_maxima != null ? String(character.vida_maxima) : undefined,
    },
    {
      label: 'CA',
      value: character.ca != null ? String(character.ca) : undefined,
    },
  ].filter(item => item.value);
}
