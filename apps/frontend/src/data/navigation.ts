export type NavModuleId = 'campaigns' | 'history' | 'bestiary' | 'heroes' | 'combat';

export interface NavItem {
  id: NavModuleId;
  label: string;
  emoji: string;
  description: string;
  requiresCampaign: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'campaigns',
    label: 'Campanhas',
    emoji: '🏰',
    description: 'Selecionar ou criar campanha',
    requiresCampaign: false,
  },
  {
    id: 'history',
    label: 'História',
    emoji: '📜',
    description: 'História principal e sidequests',
    requiresCampaign: true,
  },
  {
    id: 'bestiary',
    label: 'Grimório',
    emoji: '📖',
    description: 'NPCs, Mobs e bestiário',
    requiresCampaign: true,
  },
  {
    id: 'heroes',
    label: 'Heróis',
    emoji: '🛡️',
    description: 'Jogadores da mesa',
    requiresCampaign: true,
  },
  {
    id: 'combat',
    label: 'Arena',
    emoji: '⚔️',
    description: 'Combate por turnos',
    requiresCampaign: true,
  },
];
