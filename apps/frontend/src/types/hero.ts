import type { HeroClass, HeroRace } from '../data/heroOptions';

export interface Hero {
  id: string;
  campanha_id: string;
  nome: string;
  raca: HeroRace;
  classe: HeroClass;
  historia?: string;
  imagem_id?: string;
}

export type HeroFormData = Omit<Hero, 'id' | 'campanha_id'>;
