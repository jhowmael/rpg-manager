import type { Campaign } from '../types/campaign';

export const MOCK_SELECTED_CAMPAIGN: Campaign = {
  id: '1',
  nome: 'A Queda de Valoria',
  descricao: 'Os heróis devem impedir que o Lich Malachar ressuscite o exército das sombras.',
  criado_em: '2026-03-15T10:00:00.000Z',
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  MOCK_SELECTED_CAMPAIGN,
  {
    id: '2',
    nome: 'Masmorras de Ferro',
    descricao: 'Uma guilda de aventureiros explora as ruínas subterrâneas de uma civilização perdida.',
    criado_em: '2026-05-20T14:30:00.000Z',
  },
];
