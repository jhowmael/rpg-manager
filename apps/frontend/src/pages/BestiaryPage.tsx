import { useCallback, useEffect, useState } from 'react';
import { CharacterForm } from '../components/bestiary/CharacterForm';
import { CharacterList } from '../components/bestiary/CharacterList';
import { CharacterViewer } from '../components/bestiary/CharacterViewer';
import { PixelButton } from '../components/ui/PixelButton';
import { ApiError } from '../services/api';
import {
  createBestiaryEntry,
  deleteBestiaryEntry,
  fetchBestiary,
  updateBestiaryEntry,
} from '../services/bestiaryService';
import type { Character, CharacterFormData, CharacterType } from '../types/character';
import { resolveImageUpload } from '../utils/resolveImageUpload';

type View = 'list' | 'editor' | 'viewer';

interface EditorState {
  character?: Character;
  fixedTipo: CharacterType;
}

interface BestiaryPageProps {
  campaignId: string;
  campaignName: string;
  onCharactersChange?: (characters: Character[]) => void;
}

export function BestiaryPage({ campaignId, campaignName, onCharactersChange }: BestiaryPageProps) {
  const [view, setView] = useState<View>('list');
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const npcs = characters.filter(c => c.tipo === 'NPC');
  const mobs = characters.filter(c => c.tipo === 'MOB');
  const viewerCharacter = viewerId ? characters.find(c => c.id === viewerId) : null;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const loadBestiary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchBestiary(campaignId);
      setCharacters(data);
      onCharactersChange?.(data);
    } catch (loadError) {
      const message =
        loadError instanceof ApiError
          ? loadError.message
          : 'Não foi possível carregar o grimório.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, onCharactersChange]);

  useEffect(() => {
    void loadBestiary();
  }, [loadBestiary]);

  const goToList = () => {
    setEditorState(null);
    setViewerId(null);
    setView('list');
  };

  const openCreate = (tipo: CharacterType) => {
    setViewerId(null);
    setEditorState({ fixedTipo: tipo });
    setView('editor');
  };

  const openEdit = (character: Character) => {
    setViewerId(null);
    setEditorState({ character, fixedTipo: character.tipo });
    setView('editor');
  };

  const openView = (character: Character) => {
    setEditorState(null);
    setViewerId(character.id);
    setView('viewer');
  };

  const handleSave = async (data: CharacterFormData, imageFile?: File | null) => {
    try {
      setIsSaving(true);
      const imagem_id = await resolveImageUpload(imageFile, data.imagem_id);
      const payload = { ...data, imagem_id };

      if (editorState?.character) {
        const updated = await updateBestiaryEntry(editorState.character.id, payload);
        setCharacters(prev => {
          const next = prev.map(c => (c.id === updated.id ? updated : c));
          onCharactersChange?.(next);
          return next;
        });
        showToast('✅ Ficha atualizada!');
      } else {
        const created = await createBestiaryEntry({
          campanha_id: campaignId,
          ...payload,
        });
        setCharacters(prev => {
          const next = [...prev, created];
          onCharactersChange?.(next);
          return next;
        });
        showToast('✨ Nova entrada no grimório!');
      }
      goToList();
    } catch (saveError) {
      const message =
        saveError instanceof ApiError
          ? saveError.message
          : saveError instanceof Error
            ? saveError.message
            : 'Não foi possível salvar a ficha.';
      showToast(`⚠️ ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const character = characters.find(c => c.id === id);
    if (!character) return;

    const label = character.tipo === 'MOB' ? 'mob' : 'NPC';
    if (!window.confirm(`Excluir ${label} "${character.nome}" do grimório?`)) return;

    try {
      await deleteBestiaryEntry(id);
      setCharacters(prev => {
        const next = prev.filter(c => c.id !== id);
        onCharactersChange?.(next);
        return next;
      });
      showToast('Entrada removida do grimório.');
      if (viewerId === id) goToList();
    } catch (deleteError) {
      const message =
        deleteError instanceof ApiError
          ? deleteError.message
          : 'Não foi possível excluir a ficha.';
      showToast(`⚠️ ${message}`);
    }
  };

  const campaignBanner = (
    <p className="mb-4 text-center font-sans text-sm text-rpg-ink-faded">
      Campanha: <span className="font-semibold text-rpg-ink-dark">{campaignName}</span>
    </p>
  );

  if (isLoading) {
    return (
      <>
        {campaignBanner}
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-4xl animate-float">📖</span>
          <p className="font-sans text-base text-rpg-ink-dim">Carregando grimório...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {campaignBanner}
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-4xl opacity-60">⚠️</span>
          <p className="font-sans text-base text-rpg-ink-dim">{error}</p>
          <PixelButton type="button" variant="gold" onClick={() => void loadBestiary()}>
            Tentar novamente
          </PixelButton>
        </div>
      </>
    );
  }

  if (view === 'viewer' && viewerCharacter) {
    return (
      <>
        {campaignBanner}
        <CharacterViewer
          character={viewerCharacter}
          onBack={goToList}
          onEdit={() => openEdit(viewerCharacter)}
        />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  if (view === 'editor' && editorState) {
    return (
      <>
        {campaignBanner}
        <CharacterForm
          character={editorState.character}
          fixedTipo={editorState.fixedTipo}
          isSaving={isSaving}
          onSave={(data, imageFile) => void handleSave(data, imageFile)}
          onCancel={goToList}
        />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  return (
    <>
      {campaignBanner}
      <CharacterList
        npcs={npcs}
        mobs={mobs}
        onCreateNpc={() => openCreate('NPC')}
        onCreateMob={() => openCreate('MOB')}
        onView={openView}
        onEdit={openEdit}
        onDelete={id => void handleDelete(id)}
      />
      {toast && <Toast message={toast} />}
    </>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-6 z-50 border-2 border-rpg-border-dark bg-rpg-panel px-5 py-3 font-sans text-base text-rpg-ink-dark shadow-pixel-dark">
      {message}
    </div>
  );
}
