import type { Hero, HeroFormData } from '../types/hero';
import { apiRequest } from './api';

export async function fetchHeroes(campaignId: string): Promise<Hero[]> {
  return apiRequest<Hero[]>(`/hero?campanha_id=${encodeURIComponent(campaignId)}`);
}

export async function createHero(data: HeroFormData & { campanha_id: string }): Promise<Hero> {
  return apiRequest<Hero>('/hero', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateHero(id: string, data: Partial<HeroFormData>): Promise<Hero> {
  return apiRequest<Hero>(`/hero/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteHero(id: string): Promise<void> {
  await apiRequest(`/hero/${id}`, { method: 'DELETE' });
}
