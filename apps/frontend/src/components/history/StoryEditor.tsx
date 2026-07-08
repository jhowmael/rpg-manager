import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelInput } from '../ui/PixelInput';
import { RichTextEditor } from './RichTextEditor';
import type { MainStory, SideQuest, SideQuestStatus, StoryType } from '../../types/history';
import type { Character } from '../../types/character';

interface StoryEditorProps {
  type: StoryType;
  story?: MainStory | SideQuest;
  nextOrdem?: number;
  characters: Character[];
  isSaving?: boolean;
  onSave: (data: Omit<MainStory, 'id' | 'campanha_id'> | Omit<SideQuest, 'id' | 'campanha_id'>) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: { value: SideQuestStatus; label: string }[] = [
  { value: 'ATIVA', label: 'Ativa' },
  { value: 'INATIVA', label: 'Inativa' },
  { value: 'CONCLUIDA', label: 'Concluída' },
];

export function StoryEditor({ type, story, nextOrdem = 1, characters, isSaving = false, onSave, onCancel }: StoryEditorProps) {
  const isSideQuest = type === 'sidequest';
  const isEditing = Boolean(story);

  const [titulo, setTitulo] = useState(story?.titulo ?? '');
  const [conteudo, setConteudo] = useState(story?.conteudo ?? '');
  const [ordem, setOrdem] = useState(
    !isSideQuest && story ? (story as MainStory).ordem : nextOrdem,
  );
  const [status, setStatus] = useState<SideQuestStatus>(
    isSideQuest && story ? (story as SideQuest).status : 'INATIVA',
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) {
      setError('O título é obrigatório.');
      return;
    }

    if (!stripContent(conteudo)) {
      setError('Escreva o conteúdo da história.');
      return;
    }

    if (isSideQuest) {
      onSave({ titulo: titulo.trim(), conteudo, status });
    } else {
      onSave({ titulo: titulo.trim(), conteudo, ordem });
    }
  };

  const title = isEditing
    ? isSideQuest
      ? 'Editar Side Quest'
      : 'Editar História da Campanha'
    : isSideQuest
      ? 'Nova Side Quest'
      : 'Nova História da Campanha';

  return (
    <div className="mx-auto w-full max-w-7xl">
      <button
        type="button"
        onClick={onCancel}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar para a lista
      </button>

      <header className="mb-6 text-center">
        <p className="pixel-subtitle mb-2">
          {isSideQuest ? '📜 SIDE QUEST' : '🏰 HISTÓRIA DA CAMPANHA'}
        </p>
        <h1 className="pixel-title">{title}</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <PixelInput
          label="Título"
          placeholder={isSideQuest ? 'Ex: O Artefato Perdido' : 'Ex: Capítulo I — O Despertar'}
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          disabled={isSaving}
        />

        {!isSideQuest && (
          <div className="flex flex-col gap-2">
            <label htmlFor="ordem" className="pixel-label">
              Ordem do capítulo
            </label>
            <input
              id="ordem"
              type="number"
              min={1}
              value={ordem}
              onChange={e => setOrdem(Number(e.target.value))}
              disabled={isSaving}
              className="pixel-corners w-32 border-2 border-rpg-border bg-rpg-parchment px-3 py-2 font-sans text-base text-rpg-ink outline-none focus:border-rpg-gold disabled:opacity-60"
            />
          </div>
        )}

        {isSideQuest && (
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="pixel-label">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value as SideQuestStatus)}
              disabled={isSaving}
              className="pixel-corners w-full max-w-xs border-2 border-rpg-border bg-rpg-parchment px-3 py-2 font-sans text-base text-rpg-ink outline-none focus:border-rpg-gold disabled:opacity-60"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="pixel-label">Conteúdo</label>
          <RichTextEditor
            content={conteudo}
            onChange={setConteudo}
            characters={characters}
            placeholder="Escreva a história com formatação: negrito, listas, títulos..."
          />
        </div>

        {error && (
          <p className="font-sans text-sm text-rpg-hp">{error}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <PixelButton type="submit" variant="gold" disabled={isSaving}>
            <span className="flex items-center gap-2">
              <Save size={14} />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </span>
          </PixelButton>
          <PixelButton type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </PixelButton>
        </div>
      </form>
    </div>
  );
}

function stripContent(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const text = doc.body.textContent?.trim() ?? '';
  if (text) return text;
  const hasEmbed =
    doc.querySelector('[data-character-trigger]') ??
    doc.querySelector('[data-audio-trigger]') ??
    doc.querySelector('img');
  return hasEmbed ? 'ok' : '';
}
