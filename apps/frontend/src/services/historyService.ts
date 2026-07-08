import type { MainStory, SideQuest, SideQuestStatus } from '../types/history';
import { apiRequest } from './api';

type MainStoryApi = Omit<MainStory, 'conteudo'> & { conteudo?: string | null };
type SideQuestApi = Omit<SideQuest, 'conteudo' | 'status'> & {
  conteudo?: string | null;
  status: string;
};

function normalizeMainStory(story: MainStoryApi): MainStory {
  return {
    ...story,
    conteudo: story.conteudo ?? '',
  };
}

function normalizeSideQuest(quest: SideQuestApi): SideQuest {
  return {
    ...quest,
    conteudo: quest.conteudo ?? '',
    status: quest.status as SideQuestStatus,
  };
}

export async function fetchMainStories(campaignId: string): Promise<MainStory[]> {
  const stories = await apiRequest<MainStoryApi[]>(
    `/history/main-story?campanha_id=${encodeURIComponent(campaignId)}`,
  );
  return stories.map(normalizeMainStory);
}

export async function createMainStory(
  data: Omit<MainStory, 'id'>,
): Promise<MainStory> {
  const story = await apiRequest<MainStoryApi>('/history/main-story', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return normalizeMainStory(story);
}

export async function updateMainStory(
  id: string,
  data: Partial<Omit<MainStory, 'id' | 'campanha_id'>>,
): Promise<MainStory> {
  const story = await apiRequest<MainStoryApi>(`/history/main-story/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return normalizeMainStory(story);
}

export async function deleteMainStory(id: string): Promise<void> {
  await apiRequest(`/history/main-story/${id}`, { method: 'DELETE' });
}

export async function fetchSideQuests(campaignId: string): Promise<SideQuest[]> {
  const quests = await apiRequest<SideQuestApi[]>(
    `/history/side-quest?campanha_id=${encodeURIComponent(campaignId)}`,
  );
  return quests.map(normalizeSideQuest);
}

export async function createSideQuest(
  data: Omit<SideQuest, 'id'>,
): Promise<SideQuest> {
  const quest = await apiRequest<SideQuestApi>('/history/side-quest', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return normalizeSideQuest(quest);
}

export async function updateSideQuest(
  id: string,
  data: Partial<Omit<SideQuest, 'id' | 'campanha_id'>>,
): Promise<SideQuest> {
  const quest = await apiRequest<SideQuestApi>(`/history/side-quest/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return normalizeSideQuest(quest);
}

export async function deleteSideQuest(id: string): Promise<void> {
  await apiRequest(`/history/side-quest/${id}`, { method: 'DELETE' });
}
