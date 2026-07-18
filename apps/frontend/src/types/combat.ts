import type { CharacterAbility, CharacterAttributes } from './character';

export type { CharacterAbility, CharacterAttributes };
export { DEFAULT_ATTRIBUTES } from './character';

export type FighterSource = 'HERO' | 'NPC' | 'MOB' | 'CUSTOM';
export type EffectType = 'BUFF' | 'DEBUFF';
export type CombatPhase = 'setup' | 'initiative' | 'battle' | 'finished';
export type FighterStatus = 'active' | 'dead' | 'fled';

export interface StatusEffect {
  id: string;
  nome: string;
  tipo: EffectType;
  /** Descrição da condição (ex.: Open5e) */
  descricao?: string;
  /** Origem: open5e | manual */
  origem?: 'open5e' | 'manual';
  /** Rodadas restantes; omitido = até remover manualmente */
  duracaoRodadas?: number;
}

export interface CombatFighter {
  id: string;
  nome: string;
  source: FighterSource;
  sourceId?: string;
  imagem?: string;
  vidaMaxima: number;
  vidaAtual: number;
  ca: number;
  iniciativa: number | null;
  ordemVez: number;
  buffs: StatusEffect[];
  debuffs: StatusEffect[];
  status: FighterStatus;
  atributos?: CharacterAttributes;
  habilidades?: CharacterAbility[];
}

export interface Combat {
  id: string;
  campanha_id: string;
  nome: string;
  tempo_turno_minutos: number;
  fase: CombatPhase;
  rodada_atual: number;
  turno_atual_index: number;
  turno_iniciado_em: number | null;
  fighters: CombatFighter[];
  criado_em: string;
  encerrado_em?: string;
}

export interface NewFighterData {
  nome: string;
  source: FighterSource;
  sourceId?: string;
  imagem?: string;
  vidaMaxima: number;
  vidaAtual: number;
  ca: number;
  atributos?: CharacterAttributes;
  habilidades?: CharacterAbility[];
  /** Quando true, cria no grimório antes de adicionar ao combate */
  registerInBestiary?: boolean;
  bestiaryTipo?: 'NPC' | 'MOB';
}
