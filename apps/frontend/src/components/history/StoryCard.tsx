import { Edit, Eye, Trash2 } from 'lucide-react';
import type { MainStory, SideQuest, SideQuestStatus } from '../../types/history';
import { stripHtml, truncateText } from '../../utils/text';

const STATUS_STYLES: Record<SideQuestStatus, string> = {
  ATIVA: 'bg-rpg-forest/15 text-rpg-forest border-rpg-forest',
  INATIVA: 'bg-rpg-border/20 text-rpg-ink-faded border-rpg-border',
  CONCLUIDA: 'bg-rpg-gold/15 text-rpg-gold-dark border-rpg-gold-dark',
};

const STATUS_LABELS: Record<SideQuestStatus, string> = {
  ATIVA: 'Ativa',
  INATIVA: 'Inativa',
  CONCLUIDA: 'Concluída',
};

interface StoryCardProps {
  story: MainStory | SideQuest;
  type: 'main' | 'sidequest';
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function StoryCard({ story, type, onView, onEdit, onDelete }: StoryCardProps) {
  const excerpt = truncateText(stripHtml(story.conteudo), 140);
  const isSideQuest = type === 'sidequest';
  const sideQuest = isSideQuest ? (story as SideQuest) : null;

  return (
    <article className="group border-2 border-rpg-border bg-rpg-parchment p-4 transition-all hover:border-rpg-gold-dark hover:shadow-pixel">
      <div className="mb-2 flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onView}
          className="flex-1 text-left"
        >
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {isSideQuest && sideQuest && (
              <span
                className={[
                  'border px-2 py-0.5 font-sans text-xs font-semibold uppercase',
                  STATUS_STYLES[sideQuest.status],
                ].join(' ')}
              >
                {STATUS_LABELS[sideQuest.status]}
              </span>
            )}
            {!isSideQuest && (
              <span className="border border-rpg-border bg-rpg-panel px-2 py-0.5 font-sans text-xs text-rpg-ink-dim">
                Cap. {(story as MainStory).ordem}
              </span>
            )}
          </div>
          <h3 className="font-pixel text-pixel-xs leading-relaxed text-rpg-ink-dark group-hover:text-rpg-gold-dark sm:text-pixel-sm">
            {story.titulo}
          </h3>
        </button>
        <div className="flex shrink-0 gap-1 opacity-70 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={onView}
            title="Visualizar"
            className="border-2 border-rpg-border bg-rpg-panel p-1.5 text-rpg-forest hover:border-rpg-forest hover:bg-rpg-forest/10"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            onClick={onEdit}
            title="Editar"
            className="border-2 border-rpg-border bg-rpg-panel p-1.5 text-rpg-ink-dim hover:border-rpg-gold-dark hover:text-rpg-ink-dark"
          >
            <Edit size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Excluir"
            className="border-2 border-rpg-border bg-rpg-panel p-1.5 text-rpg-hp hover:border-rpg-hp hover:bg-rpg-hp/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <button type="button" onClick={onView} className="w-full text-left">
        <p className="font-sans text-sm leading-relaxed text-rpg-ink-dim">
          {excerpt || 'Sem conteúdo ainda.'}
        </p>
      </button>
    </article>
  );
}
