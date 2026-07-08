export class CombatParticipant {
  id: string;
  combate_id: string;
  jogador_id?: string;
  personagem_id?: string;
  nome_combate: string;
  tipo_participante: string; // 'JOGADOR', 'NPC', 'MOB'
  vida_atual: number;
  ca_atual: number;
  iniciativa: number;
  ordem_vez: number;
  ativo: boolean;
}
