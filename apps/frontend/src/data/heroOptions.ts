export const HERO_RACES = [
  'Anão',
  'Elfo',
  'Halfling',
  'Humano',
  'Draconato',
  'Gnomo',
  'Meio-Elfo',
  'Meio-Orc',
  'Tiefling',
] as const;

export const HERO_CLASSES = [
  'Bárbaro',
  'Bardo',
  'Bruxo',
  'Clérigo',
  'Druida',
  'Feiticeiro (Sorcerer)',
  'Guerreiro',
  'Ladino (Rogue)',
  'Mago (Wizard)',
  'Monge',
  'Paladino',
  'Patrulheiro',
] as const;

export type HeroRace = (typeof HERO_RACES)[number];
export type HeroClass = (typeof HERO_CLASSES)[number];
