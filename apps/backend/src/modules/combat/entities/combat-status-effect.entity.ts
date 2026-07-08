export class CombatStatusEffect {
  id: string;
  participante_id: string;
  nome_efeito: string;
  tipo: string; // 'BUFF' ou 'DEBUFF'
  duracao_rodadas?: number;
  ativo?: boolean;
}
