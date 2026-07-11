export const CHARACTER_DRAG_TYPE = 'application/rpg-character';

export interface CharacterDragPayload {
  characterId: string;
  nome: string;
  tipo: string;
}
