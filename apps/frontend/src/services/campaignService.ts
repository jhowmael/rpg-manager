import type { Campaign, CreateCampaignInput, UpdateCampaignInput } from '../types/campaign';
import { apiRequest } from './api';

type CampaignApiResponse = Omit<Campaign, 'criado_em'> & {
  criado_em: string | Date;
};

function normalizeCampaign(campaign: CampaignApiResponse): Campaign {
  return {
    ...campaign,
    descricao: campaign.descricao ?? '',
    criado_em:
      typeof campaign.criado_em === 'string'
        ? campaign.criado_em
        : new Date(campaign.criado_em).toISOString(),
  };
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const campaigns = await apiRequest<CampaignApiResponse[]>('/campaign');
  return campaigns.map(normalizeCampaign);
}

export async function fetchCampaignById(id: string): Promise<Campaign> {
  const campaign = await apiRequest<CampaignApiResponse>(`/campaign/${id}`);
  return normalizeCampaign(campaign);
}

export async function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  const campaign = await apiRequest<CampaignApiResponse>('/campaign', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  return normalizeCampaign(campaign);
}

export async function updateCampaign(
  id: string,
  input: UpdateCampaignInput,
): Promise<Campaign> {
  const campaign = await apiRequest<CampaignApiResponse>(`/campaign/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });

  return normalizeCampaign(campaign);
}

export async function deleteCampaign(id: string): Promise<void> {
  await apiRequest(`/campaign/${id}`, { method: 'DELETE' });
}
