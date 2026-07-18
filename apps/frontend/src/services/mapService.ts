import type { CampaignMap, MapFormData } from '../types/map';
import { apiRequest } from './api';

export async function fetchMaps(campaignId: string): Promise<CampaignMap[]> {
  return apiRequest<CampaignMap[]>(`/maps?campanha_id=${encodeURIComponent(campaignId)}`);
}

export async function createMap(
  data: MapFormData & { campanha_id: string },
): Promise<CampaignMap> {
  return apiRequest<CampaignMap>('/maps', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMap(
  id: string,
  data: Partial<MapFormData>,
): Promise<CampaignMap> {
  return apiRequest<CampaignMap>(`/maps/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteMap(id: string): Promise<void> {
  await apiRequest(`/maps/${id}`, { method: 'DELETE' });
}
