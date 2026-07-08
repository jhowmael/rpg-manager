export interface Campaign {
  id: string;
  nome: string;
  descricao?: string;
  sistema_rpg?: string;
  criado_em: string;
}

export interface CreateCampaignInput {
  nome: string;
  descricao?: string;
  sistema_rpg?: string;
}

export type UpdateCampaignInput = Partial<CreateCampaignInput>;
