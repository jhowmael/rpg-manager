import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { ArrowLeft, Edit, Eye, Map } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { ImageLightbox } from '../ui/ImageLightbox';
import { getStoryExtensions, STORY_CONTENT_CLASS } from './storyExtensions';
import { stopAllAudio } from '../../hooks/useAudioPlayer';
import { getEntityImageUrl } from '../../utils/entityImage';
import type { MainStory, SideQuest, SideQuestStatus } from '../../types/history';
import type { CampaignMap } from '../../types/map';

const STATUS_LABELS: Record<SideQuestStatus, string> = {
  ATIVA: 'Ativa',
  INATIVA: 'Inativa',
  CONCLUIDA: 'Concluída',
};

interface StoryViewerProps {
  story: MainStory | SideQuest;
  type: 'main' | 'sidequest';
  maps?: CampaignMap[];
  onBack: () => void;
  onEdit: () => void;
}

export function StoryViewer({ story, type, maps = [], onBack, onEdit }: StoryViewerProps) {
  const isSideQuest = type === 'sidequest';
  const sideQuest = isSideQuest ? (story as SideQuest) : null;
  const [previewMap, setPreviewMap] = useState<CampaignMap | null>(null);
  const previewUrl = getEntityImageUrl(previewMap?.imagem_id);

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
            🔊 Sons · 👤 NPCs/Mobs abrem a ficha · 🗺️ Clique no mapa para ampliar
          </span>
        </div>
      </header>

      {maps.length > 0 && (
        <section className="mb-6 border-2 border-rpg-border bg-rpg-panel p-4 shadow-pixel">
          <div className="mb-3 flex items-center gap-2">
            <Map size={14} className="text-rpg-mana" />
            <h2 className="pixel-label mb-0">Mapas da campanha</h2>
            <span className="ml-auto font-sans text-[10px] text-rpg-ink-faded">
              Clique para ampliar
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {maps.map(map => {
              const url = getEntityImageUrl(map.imagem_id);
              return (
                <button
                  key={map.id}
                  type="button"
                  disabled={!url}
                  onClick={() => url && setPreviewMap(map)}
                  title={url ? `Ampliar ${map.nome}` : `${map.nome} (sem imagem)`}
                  className="group overflow-hidden border-2 border-rpg-mana/40 bg-rpg-parchment text-left transition-colors hover:border-rpg-mana disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="relative aspect-[4/3] bg-rpg-panel">
                    {url ? (
                      <img
                        src={url}
                        alt={map.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl opacity-40">
                        🗺️
                      </div>
                    )}
                    {url && (
                      <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 border border-rpg-border bg-rpg-panel/95 px-1.5 py-0.5 font-sans text-[9px] font-semibold text-rpg-ink-dark opacity-0 transition-opacity group-hover:opacity-100">
                        <Eye size={10} />
                        Zoom
                      </span>
                    )}
                  </div>
                  <p className="truncate border-t border-rpg-mana/30 px-2 py-1.5 font-sans text-[11px] font-semibold text-rpg-mana">
                    {map.nome}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

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

      {previewMap && previewUrl && (
        <ImageLightbox
          src={previewUrl}
          alt={previewMap.nome}
          onClose={() => setPreviewMap(null)}
        />
      )}
    </div>
  );
}
