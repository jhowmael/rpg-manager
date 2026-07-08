import { Plus, ScrollText } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { StoryCard } from './StoryCard';
import type { MainStory, SideQuest } from '../../types/history';

interface StoryListProps {
  mainStories: MainStory[];
  sideQuests: SideQuest[];
  onCreateMain: () => void;
  onCreateSideQuest: () => void;
  onViewMain: (story: MainStory) => void;
  onViewSideQuest: (story: SideQuest) => void;
  onEditMain: (story: MainStory) => void;
  onEditSideQuest: (story: SideQuest) => void;
  onDeleteMain: (id: string) => void;
  onDeleteSideQuest: (id: string) => void;
}

export function StoryList({
  mainStories,
  sideQuests,
  onCreateMain,
  onCreateSideQuest,
  onViewMain,
  onViewSideQuest,
  onEditMain,
  onEditSideQuest,
  onDeleteMain,
  onDeleteSideQuest,
}: StoryListProps) {
  const sortedMain = [...mainStories].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <ScrollText size={20} className="text-rpg-gold-dark" />
          <h1 className="pixel-title">CRÔNICAS</h1>
          <ScrollText size={20} className="text-rpg-gold-dark" />
        </div>
        <p className="font-sans text-base text-rpg-ink-dim">
          Histórias da campanha e side quests da aventura
        </p>
      </header>

      <PixelCard title="História da Campanha" icon="🏰">
        <div className="mb-4 flex justify-end">
          <PixelButton variant="forest" onClick={onCreateMain}>
            <span className="flex items-center gap-2">
              <Plus size={14} />
              Novo Capítulo
            </span>
          </PixelButton>
        </div>

        {sortedMain.length === 0 ? (
          <EmptyState
            emoji="📖"
            message="Nenhum capítulo da história principal ainda."
            hint="Crie o primeiro capítulo da campanha!"
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {sortedMain.map(story => (
              <li key={story.id}>
                <StoryCard
                  story={story}
                  type="main"
                  onView={() => onViewMain(story)}
                  onEdit={() => onEditMain(story)}
                  onDelete={() => onDeleteMain(story.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </PixelCard>

      <PixelCard title="Side Quests" icon="📜">
        <div className="mb-4 flex justify-end">
          <PixelButton variant="forest" onClick={onCreateSideQuest}>
            <span className="flex items-center gap-2">
              <Plus size={14} />
              Nova Side Quest
            </span>
          </PixelButton>
        </div>

        {sideQuests.length === 0 ? (
          <EmptyState
            emoji="🗺️"
            message="Nenhuma side quest cadastrada."
            hint="Adicione missões secundárias para os jogadores explorarem!"
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {sideQuests.map(story => (
              <li key={story.id}>
                <StoryCard
                  story={story}
                  type="sidequest"
                  onView={() => onViewSideQuest(story)}
                  onEdit={() => onEditSideQuest(story)}
                  onDelete={() => onDeleteSideQuest(story.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </PixelCard>
    </div>
  );
}

function EmptyState({
  emoji,
  message,
  hint,
}: {
  emoji: string;
  message: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 border-2 border-dashed border-rpg-border py-10 text-center">
      <span className="text-4xl opacity-50">{emoji}</span>
      <p className="font-sans text-base text-rpg-ink-dim">{message}</p>
      <p className="font-sans text-sm text-rpg-ink-faded">{hint}</p>
    </div>
  );
}
