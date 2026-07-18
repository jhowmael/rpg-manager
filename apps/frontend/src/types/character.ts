export type CharacterType = 'NPC' | 'MOB';

export interface CharacterAttributes {
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
}

export interface CharacterAbility {
  id: string;
  nome: string;
  descricao: string;
}

export const DEFAULT_ATTRIBUTES: CharacterAttributes = {
  forca: 10,
  destreza: 10,
  constituicao: 10,
  inteligencia: 10,
  sabedoria: 10,
  carisma: 10,
};

export interface Character {
  id: string;
  campanha_id: string;
  nome: string;
  titulo?: string;
  raca?: string;
  classe?: string;
  tipo: CharacterType;
  imagem_id?: string;
  historia?: string;
  caracteristicas?: string;
  o_que_sabe?: string;
  personalidade?: string[];
  familia_relacoes?: string;
  atributos?: CharacterAttributes;
  habilidades?: CharacterAbility[];
}

export type CharacterFormData = Omit<Character, 'id' | 'campanha_id'>;

export function getCharacterEmoji(tipo: CharacterType): string {
  return tipo === 'NPC' ? '👤' : '💀';
}
