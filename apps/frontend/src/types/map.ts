export interface CampaignMap {
  id: string;
  campanha_id: string;
  nome: string;
  descricao?: string;
  imagem_id?: string;
}

export type MapFormData = Omit<CampaignMap, 'id' | 'campanha_id'>;
