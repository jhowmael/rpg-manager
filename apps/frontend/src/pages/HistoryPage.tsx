import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { StoryEditor, type StorySaveOptions } from '../components/history/StoryEditor';
import { StoryList } from '../components/history/StoryList';
import { StoryViewer } from '../components/history/StoryViewer';
import { CharacterDetailPage } from '../components/history/CharacterDetailPage';
import { AudioControllerPanel } from '../components/history/AudioControllerPanel';
import { CharacterNavigationProvider } from '../context/CharacterNavigationContext';
import { stopAllAudio } from '../hooks/useAudioPlayer';
import { ApiError } from '../services/api';
import {
  createMainStory,
  createSideQuest,
  deleteMainStory,
  deleteSideQuest,
  fetchMainStories,
  fetchSideQuests,
  updateMainStory,
  updateSideQuest,
} from '../services/historyService';
import type { Character } from '../types/character';
import type { CampaignMap } from '../types/map';
import type { MainStory, SideQuest, StoryType } from '../types/history';
import { PixelButton } from '../components/ui/PixelButton';

type View = 'list' | 'editor' | 'viewer';

interface EditorState {
  type: StoryType;
  story?: MainStory | SideQuest;
}

interface ViewerState {
  type: StoryType;
  story: MainStory | SideQuest;
}

interface HistoryPageProps {
  campaignId: string;
  campaignName: string;
  characters: Character[];
  maps: CampaignMap[];
}

export function HistoryPage({ campaignId, campaignName, characters, maps }: HistoryPageProps) {
  const [view, setView] = useState<View>('list');
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [viewerState, setViewerState] = useState<ViewerState | null>(null);
  const [characterOverlayId, setCharacterOverlayId] = useState<string | null>(null);
  const [mainStories, setMainStories] = useState<MainStory[]>([]);
  const [sideQuests, setSideQuests] = useState<SideQuest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const campaignCharacters = characters.filter(c => c.campanha_id === campaignId);
  const campaignMaps = maps.filter(m => m.campanha_id === campaignId);
  const overlayCharacter = characterOverlayId
    ? campaignCharacters.find(c => c.id === characterOverlayId)
    : null;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [stories, quests] = await Promise.all([
        fetchMainStories(campaignId),
        fetchSideQuests(campaignId),
      ]);
      setMainStories(stories);
      setSideQuests(quests);
    } catch (loadError) {
      const message =
        loadError instanceof ApiError
          ? loadError.message
          : 'Não foi possível carregar as histórias.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const goToList = () => {
    stopAllAudio();
    setCharacterOverlayId(null);
    setEditorState(null);
    setViewerState(null);
    setView('list');
  };

  const openCreate = (type: StoryType) => {
    stopAllAudio();
    setCharacterOverlayId(null);
    setViewerState(null);
    setEditorState({ type });
    setView('editor');
  };

  const openEdit = (type: StoryType, story: MainStory | SideQuest) => {
    stopAllAudio();
    setCharacterOverlayId(null);
    setViewerState(null);
    setEditorState({ type, story });
    setView('editor');
  };

  const openView = (type: StoryType, story: MainStory | SideQuest) => {
    stopAllAudio();
    setCharacterOverlayId(null);
    setEditorState(null);
    setViewerState({ type, story });
    setView('viewer');
  };

  const openCharacter = (characterId: string) => {
    setCharacterOverlayId(characterId);
  };

  const closeCharacter = () => {
    setCharacterOverlayId(null);
  };

  const getStoryById = (type: StoryType, id: string): MainStory | SideQuest | undefined => {
    if (type === 'main') return mainStories.find(s => s.id === id);
    return sideQuests.find(s => s.id === id);
  };

  const handleSaveMain = async (
    data: Omit<MainStory, 'id' | 'campanha_id'>,
    options?: StorySaveOptions,
  ) => {
    try {
      setIsSaving(true);
      if (editorState?.story) {
        const updated = await updateMainStory(editorState.story.id, data);
        setMainStories(prev => prev.map(s => (s.id === updated.id ? updated : s)));
        if (options?.continueEditing) {
          setEditorState({ type: 'main', story: updated });
          showToast('✅ Capítulo salvo! Continue editando.');
        } else {
          showToast('✅ Capítulo atualizado!');
          goToList();
        }
      } else {
        const created = await createMainStory({
          campanha_id: campaignId,
          ...data,
        });
        setMainStories(prev => [...prev, created]);
        if (options?.continueEditing) {
          setEditorState({ type: 'main', story: created });
          showToast('✨ Capítulo criado! Continue editando.');
        } else {
          showToast('✨ Novo capítulo criado!');
          goToList();
        }
      }
    } catch (saveError) {
      const message =
        saveError instanceof ApiError
          ? saveError.message
          : 'Não foi possível salvar o capítulo.';
      showToast(`⚠️ ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSideQuest = async (
    data: Omit<SideQuest, 'id' | 'campanha_id'>,
    options?: StorySaveOptions,
  ) => {
    try {
      setIsSaving(true);
      if (editorState?.story) {
        const updated = await updateSideQuest(editorState.story.id, data);
        setSideQuests(prev => prev.map(s => (s.id === updated.id ? updated : s)));
        if (options?.continueEditing) {
          setEditorState({ type: 'sidequest', story: updated });
          showToast('✅ Side quest salva! Continue editando.');
        } else {
          showToast('✅ Side quest atualizada!');
          goToList();
        }
      } else {
        const created = await createSideQuest({
          campanha_id: campaignId,
          ...data,
        });
        setSideQuests(prev => [...prev, created]);
        if (options?.continueEditing) {
          setEditorState({ type: 'sidequest', story: created });
          showToast('✨ Side quest criada! Continue editando.');
        } else {
          showToast('✨ Nova side quest criada!');
          goToList();
        }
      }
    } catch (saveError) {
      const message =
        saveError instanceof ApiError
          ? saveError.message
          : 'Não foi possível salvar a side quest.';
      showToast(`⚠️ ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMain = async (id: string) => {
    if (!window.confirm('Excluir este capítulo da história principal?')) return;

    try {
      await deleteMainStory(id);
      setMainStories(prev => prev.filter(s => s.id !== id));
      showToast('Capítulo removido.');
    } catch (deleteError) {
      const message =
        deleteError instanceof ApiError
          ? deleteError.message
          : 'Não foi possível excluir o capítulo.';
      showToast(`⚠️ ${message}`);
    }
  };

  const handleDeleteSideQuest = async (id: string) => {
    if (!window.confirm('Excluir esta side quest?')) return;

    try {
      await deleteSideQuest(id);
      setSideQuests(prev => prev.filter(s => s.id !== id));
      showToast('Side quest removida.');
    } catch (deleteError) {
      const message =
        deleteError instanceof ApiError
          ? deleteError.message
          : 'Não foi possível excluir a side quest.';
      showToast(`⚠️ ${message}`);
    }
  };

  const nextOrdem =
    mainStories.length > 0 ? Math.max(...mainStories.map(s => s.ordem)) + 1 : 1;

  const campaignBanner = (
    <p className="mb-4 text-center font-sans text-sm text-rpg-ink-faded">
      Campanha: <span className="font-semibold text-rpg-ink-dark">{campaignName}</span>
    </p>
  );

  const pageShell = (content: ReactNode) => (
    <CharacterNavigationProvider onOpenCharacter={openCharacter}>
      <AudioControllerPanel />
      {campaignBanner}
      {content}
      {overlayCharacter && (
        <CharacterDetailPage character={overlayCharacter} onBack={closeCharacter} />
      )}
      {toast && <Toast message={toast} />}
    </CharacterNavigationProvider>
  );

  if (isLoading) {
    return pageShell(
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-4xl animate-float">📜</span>
        <p className="font-sans text-base text-rpg-ink-dim">Carregando histórias...</p>
      </div>,
    );
  }

  if (error) {
    return pageShell(
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-4xl opacity-60">⚠️</span>
        <p className="font-sans text-base text-rpg-ink-dim">{error}</p>
        <PixelButton type="button" variant="gold" onClick={() => void loadHistory()}>
          Tentar novamente
        </PixelButton>
      </div>,
    );
  }

  if (view === 'viewer' && viewerState) {
    const freshStory = getStoryById(viewerState.type, viewerState.story.id) ?? viewerState.story;

    return pageShell(
      <StoryViewer
        story={freshStory}
        type={viewerState.type}
        maps={campaignMaps}
        onBack={goToList}
        onEdit={() => openEdit(viewerState.type, freshStory)}
      />,
    );
  }

  if (view === 'editor' && editorState) {
    return pageShell(
      <StoryEditor
        type={editorState.type}
        story={editorState.story}
        nextOrdem={nextOrdem}
        characters={campaignCharacters}
        maps={campaignMaps}
        isSaving={isSaving}
        onSave={(data, options) => {
          if (editorState.type === 'main') {
            void handleSaveMain(data as Omit<MainStory, 'id' | 'campanha_id'>, options);
          } else {
            void handleSaveSideQuest(data as Omit<SideQuest, 'id' | 'campanha_id'>, options);
          }
        }}
        onCancel={goToList}
      />,
    );
  }

  return pageShell(
    <StoryList
      mainStories={mainStories}
      sideQuests={sideQuests}
      onCreateMain={() => openCreate('main')}
      onCreateSideQuest={() => openCreate('sidequest')}
      onViewMain={story => openView('main', story)}
      onViewSideQuest={story => openView('sidequest', story)}
      onEditMain={story => openEdit('main', story)}
      onEditSideQuest={story => openEdit('sidequest', story)}
      onDeleteMain={id => void handleDeleteMain(id)}
      onDeleteSideQuest={id => void handleDeleteSideQuest(id)}
    />,
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-6 z-50 border-2 border-rpg-border-dark bg-rpg-panel px-5 py-3 font-sans text-base text-rpg-ink-dark shadow-pixel-dark">
      {message}
    </div>
  );
}
