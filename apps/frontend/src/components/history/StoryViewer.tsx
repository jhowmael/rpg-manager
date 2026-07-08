import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { ArrowLeft, Edit } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { getStoryExtensions, STORY_CONTENT_CLASS } from './storyExtensions';
import { stopAllAudio } from '../../hooks/useAudioPlayer';
import type { MainStory, SideQuest, SideQuestStatus } from '../../types/history';

const STATUS_LABELS: Record<SideQuestStatus, string> = {
  ATIVA: 'Ativa',
  INATIVA: 'Inativa',
  CONCLUIDA: 'Concluída',
};

interface StoryViewerProps {
  story: MainStory | SideQuest;
  type: 'main' | 'sidequest';
  onBack: () => void;
  onEdit: () => void;
}

export function StoryViewer({ story, type, onBack, onEdit }: StoryViewerProps) {
  const isSideQuest = type === 'sidequest';
  const sideQuest = isSideQuest ? (story as SideQuest) : null;

  const editor = useEditor({
    extensions: getStoryExtensions(),
    content: story.conteudo,
    editable: false,
    editorProps: {
      attributes: {
        class: `${STORY_CONTENT_CLASS} min-h-[200px]`,
      },
    },
  });

  useEffect(() => {
    return () => stopAllAudio();
  }, []);

  useEffect(() => {
    if (editor && story.conteudo !== editor.getHTML()) {
      editor.commands.setContent(story.conteudo);
    }
  }, [editor, story.conteudo]);

  return (
    <div className="mx-auto max-w-4xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar para a lista
      </button>

      <header className="mb-6 border-2 border-rpg-border bg-rpg-panel p-6 shadow-pixel">
        <p className="pixel-subtitle mb-2">
          {isSideQuest ? '📜 SIDE QUEST' : '🏰 HISTÓRIA DA CAMPANHA'}
        </p>
        <h1 className="pixel-title mb-3">{story.titulo}</h1>
        <div className="flex flex-wrap items-center gap-3 font-sans text-sm text-rpg-ink-dim">
          {isSideQuest && sideQuest && (
            <span className="border border-rpg-border bg-rpg-parchment px-2 py-0.5 font-semibold uppercase">
              {STATUS_LABELS[sideQuest.status]}
            </span>
          )}
          {!isSideQuest && (
            <span className="border border-rpg-border bg-rpg-parchment px-2 py-0.5">
              Capítulo {(story as MainStory).ordem}
            </span>
          )}
          <span className="text-rpg-ink-faded">
            🔊 Sons & músicas · 👤 Clique nos NPCs/Mobs para ver a ficha
          </span>
        </div>
      </header>

      <article className="border-2 border-rpg-border bg-rpg-parchment shadow-pixel">
        <EditorContent editor={editor} />
      </article>

      <div className="mt-6 flex flex-wrap gap-3">
        <PixelButton variant="gold" onClick={onEdit}>
          <span className="flex items-center gap-2">
            <Edit size={14} />
            Editar
          </span>
        </PixelButton>
        <PixelButton variant="ghost" onClick={onBack}>
          Voltar
        </PixelButton>
      </div>
    </div>
  );
}
