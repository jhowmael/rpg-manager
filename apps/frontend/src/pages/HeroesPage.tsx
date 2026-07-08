import { useCallback, useEffect, useState } from 'react';
import { HeroForm } from '../components/heroes/HeroForm';
import { HeroList } from '../components/heroes/HeroList';
import { HeroViewer } from '../components/heroes/HeroViewer';
import { PixelButton } from '../components/ui/PixelButton';
import { ApiError } from '../services/api';
import {
  createHero,
  deleteHero,
  fetchHeroes,
  updateHero,
} from '../services/heroService';
import type { Hero, HeroFormData } from '../types/hero';
import { resolveImageUpload } from '../utils/resolveImageUpload';

type View = 'list' | 'editor' | 'viewer';

interface HeroesPageProps {
  campaignId: string;
  campaignName: string;
  onHeroesChange?: (heroes: Hero[]) => void;
}

export function HeroesPage({ campaignId, campaignName, onHeroesChange }: HeroesPageProps) {
  const [view, setView] = useState<View>('list');
  const [editingHero, setEditingHero] = useState<Hero | undefined>();
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const viewerHero = viewerId ? heroes.find(h => h.id === viewerId) : null;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const loadHeroes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchHeroes(campaignId);
      setHeroes(data);
      onHeroesChange?.(data);
    } catch (loadError) {
      const message =
        loadError instanceof ApiError
          ? loadError.message
          : 'Não foi possível carregar os heróis.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, onHeroesChange]);

  useEffect(() => {
    void loadHeroes();
  }, [loadHeroes]);

  const goToList = () => {
    setEditingHero(undefined);
    setViewerId(null);
    setView('list');
  };

  const openCreate = () => {
    setViewerId(null);
    setEditingHero(undefined);
    setView('editor');
  };

  const openEdit = (hero: Hero) => {
    setViewerId(null);
    setEditingHero(hero);
    setView('editor');
  };

  const openView = (hero: Hero) => {
    setEditingHero(undefined);
    setViewerId(hero.id);
    setView('viewer');
  };

  const handleSave = async (data: HeroFormData, imageFile?: File | null) => {
    try {
      setIsSaving(true);
      const imagem_id = await resolveImageUpload(imageFile, data.imagem_id);
      const payload = { ...data, imagem_id };

      if (editingHero) {
        const updated = await updateHero(editingHero.id, payload);
        setHeroes(prev => {
          const next = prev.map(h => (h.id === updated.id ? updated : h));
          onHeroesChange?.(next);
          return next;
        });
        showToast('✅ Herói atualizado!');
      } else {
        const created = await createHero({
          campanha_id: campaignId,
          ...payload,
        });
        setHeroes(prev => {
          const next = [...prev, created];
          onHeroesChange?.(next);
          return next;
        });
        showToast('✨ Novo herói registrado!');
      }
      goToList();
    } catch (saveError) {
      const message =
        saveError instanceof ApiError
          ? saveError.message
          : saveError instanceof Error
            ? saveError.message
            : 'Não foi possível salvar o herói.';
      showToast(`⚠️ ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const hero = heroes.find(h => h.id === id);
    if (!hero) return;

    if (!window.confirm(`Excluir herói "${hero.nome}" da campanha?`)) return;

    try {
      await deleteHero(id);
      setHeroes(prev => {
        const next = prev.filter(h => h.id !== id);
        onHeroesChange?.(next);
        return next;
      });
      showToast('Herói removido.');
      if (viewerId === id) goToList();
    } catch (deleteError) {
      const message =
        deleteError instanceof ApiError
          ? deleteError.message
          : 'Não foi possível excluir o herói.';
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
          <span className="text-4xl animate-float">🛡️</span>
          <p className="font-sans text-base text-rpg-ink-dim">Carregando heróis...</p>
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
          <PixelButton type="button" variant="gold" onClick={() => void loadHeroes()}>
            Tentar novamente
          </PixelButton>
        </div>
      </>
    );
  }

  if (view === 'viewer' && viewerHero) {
    return (
      <>
        {campaignBanner}
        <HeroViewer hero={viewerHero} onBack={goToList} onEdit={() => openEdit(viewerHero)} />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  if (view === 'editor') {
    return (
      <>
        {campaignBanner}
        <HeroForm
          hero={editingHero}
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
      <HeroList
        heroes={heroes}
        onCreate={openCreate}
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
