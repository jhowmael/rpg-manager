export type CharacterType = 'NPC' | 'MOB';

export interface Character {
  id: string;
  campanha_id: string;
  nome: string;
  tipo: CharacterType;
  imagem_id?: string;
  historia?: string;
  o_que_sabe?: string;
  personalidade?: string;
  familia_relacoes?: string;
}

export type CharacterFormData = Omit<Character, 'id' | 'campanha_id'>;

export function getCharacterEmoji(tipo: CharacterType): string {
  return tipo === 'NPC' ? '👤' : '💀';
}
