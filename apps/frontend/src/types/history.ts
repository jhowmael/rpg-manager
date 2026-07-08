export type StoryType = 'main' | 'sidequest';

export type SideQuestStatus = 'ATIVA' | 'INATIVA' | 'CONCLUIDA';

export interface MainStory {
  id: string;
  campanha_id: string;
  titulo: string;
  conteudo: string;
  ordem: number;
}

export interface SideQuest {
  id: string;
  campanha_id: string;
  titulo: string;
  conteudo: string;
  status: SideQuestStatus;
}

export type Story = MainStory | SideQuest;

export function isSideQuest(story: Story): story is SideQuest {
  return 'status' in story;
}

export function isMainStory(story: Story): story is MainStory {
  return 'ordem' in story && !('status' in story);
}
