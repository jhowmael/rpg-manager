import type { Character, CharacterFormData, CharacterType } from '../types/character';
import { apiRequest } from './api';

export async function fetchBestiary(campaignId: string): Promise<Character[]> {
  return apiRequest<Character[]>(`/bestiary?campanha_id=${encodeURIComponent(campaignId)}`);
}

export async function createBestiaryEntry(
  data: CharacterFormData & { campanha_id: string },
): Promise<Character> {
  return apiRequest<Character>('/bestiary', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBestiaryEntry(
  id: string,
  data: Partial<CharacterFormData>,
): Promise<Character> {
  return apiRequest<Character>(`/bestiary/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteBestiaryEntry(id: string): Promise<void> {
  await apiRequest(`/bestiary/${id}`, { method: 'DELETE' });
}

export type { CharacterType };
