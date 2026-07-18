import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { PixelButton } from './PixelButton';
import {
  fetchRemoteImageAsFile,
  resolveMonsterImageUrl,
  searchOpen5eMonsters,
  type Open5eMonsterSummary,
} from '../../services/open5eService';
import {
  searchScryfallCardImages,
  type ScryfallCardImage,
} from '../../services/scryfallService';
import { validateImageFile } from '../../utils/imageUpload';

type UnifiedImageItem =
  | { kind: 'srd'; item: Open5eMonsterSummary }
  | { kind: 'scryfall'; item: ScryfallCardImage };

interface Open5eImagePickerProps {
  open: boolean;
  onClose: () => void;
  onSelectFile: (file: File) => void;
}

export function Open5eImagePicker({ open, onClose, onSelectFile }: Open5eImagePickerProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('dragon');
  const [items, setItems] = useState<UnifiedImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim() || 'dragon');
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      const [srdResult, scryfallResult] = await Promise.allSettled([
        searchOpen5eMonsters(debouncedQuery),
        searchScryfallCardImages(debouncedQuery),
      ]);

      if (cancelled) return;

      const srdItems =
        srdResult.status === 'fulfilled'
          ? srdResult.value.map((item): UnifiedImageItem => ({ kind: 'srd', item }))
          : [];
      const scryfallItems =
        scryfallResult.status === 'fulfilled'
          ? scryfallResult.value.map((item): UnifiedImageItem => ({ kind: 'scryfall', item }))
          : [];

      // Intercala resultados das duas fontes
      const merged: UnifiedImageItem[] = [];
      const maxLen = Math.max(srdItems.length, scryfallItems.length);
      for (let i = 0; i < maxLen; i += 1) {
        if (i < srdItems.length) merged.push(srdItems[i]);
        if (i < scryfallItems.length) merged.push(scryfallItems[i]);
      }

      setItems(merged);

      if (srdResult.status === 'rejected' && scryfallResult.status === 'rejected') {
        setError('Falha ao buscar imagens.');
      } else if (srdResult.status === 'rejected') {
        setError('Open5e indisponível; mostrando Scryfall.');
      } else if (scryfallResult.status === 'rejected') {
        setError('Scryfall indisponível; mostrando Open5e.');
      }
      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [open, debouncedQuery]);

  if (!open) return null;

  const handleSelectSrd = async (item: Open5eMonsterSummary) => {
    setSelectingId(item.slug);
    setError(null);
    try {
      const imageUrl = await resolveMonsterImageUrl(item.name, item.imageUrl);
      if (!imageUrl) {
        setError(`Não achamos imagem para "${item.name}". Tente outro resultado.`);
        return;
      }
      await applyImageUrl(imageUrl, item.name);
    } catch {
      setError('Não foi possível baixar a imagem.');
    } finally {
      setSelectingId(null);
    }
  };

  const handleSelectScryfall = async (item: ScryfallCardImage) => {
    setSelectingId(item.id);
    setError(null);
    try {
      await applyImageUrl(item.imageUrl, item.name);
    } catch {
      setError('Não foi possível baixar a imagem da Scryfall.');
    } finally {
      setSelectingId(null);
    }
  };

  const applyImageUrl = async (imageUrl: string, name: string) => {
    const file = await fetchRemoteImageAsFile(imageUrl, name);
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSelectFile(file);
    onClose();
  };

  const itemKey = (entry: UnifiedImageItem) =>
    entry.kind === 'srd' ? `srd-${entry.item.slug}` : `scryfall-${entry.item.id}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-rpg-void/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Buscar imagem"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(90dvh,42rem)] w-full max-w-3xl flex-col overflow-hidden border-2 border-rpg-border bg-rpg-panel shadow-pixel"
        onClick={event => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b-2 border-rpg-border bg-rpg-parchment/70 px-4 py-3">
          <div>
            <p className="pixel-label mb-1">Retrato</p>
            <h2 className="font-pixel text-[11px] leading-relaxed text-rpg-ink-dark sm:text-pixel-xs">
              Buscar imagem
            </h2>
            <p className="mt-1 font-sans text-[11px] text-rpg-ink-faded">
              Pesquisa no Open5e (SRD) e na Scryfall ao mesmo tempo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border-2 border-rpg-border bg-rpg-parchment p-1.5 text-rpg-ink-dim hover:border-rpg-gold-dark hover:text-rpg-ink-dark"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </header>

        <div className="border-b border-rpg-border px-4 py-3">
          <label className="flex items-center gap-2 border-2 border-rpg-border bg-rpg-parchment px-3 py-2">
            <Search size={14} className="shrink-0 text-rpg-ink-faded" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Buscar (ex: goblin, dragon, phoenix)…"
              className="min-w-0 flex-1 bg-transparent font-sans text-sm text-rpg-ink outline-none"
              autoFocus
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {loading && (
            <p className="py-10 text-center font-sans text-sm text-rpg-ink-faded">
              Buscando imagens…
            </p>
          )}

          {!loading && error && items.length === 0 && (
            <p className="py-6 text-center font-sans text-sm text-rpg-hp">{error}</p>
          )}

          {!loading && items.length === 0 && !error && (
            <p className="py-10 text-center font-sans text-sm text-rpg-ink-faded">
              Nenhum resultado. Tente outro termo.
            </p>
          )}

          {!loading && items.length > 0 && (
            <>
              {error && <p className="mb-3 font-sans text-xs text-rpg-hp">{error}</p>}
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {items.map(entry => (
                  <li key={itemKey(entry)}>
                    {entry.kind === 'srd' ? (
                      <MonsterImageCard
                        item={entry.item}
                        busy={selectingId === entry.item.slug}
                        disabled={Boolean(selectingId)}
                        onSelect={() => void handleSelectSrd(entry.item)}
                      />
                    ) : (
                      <ScryfallImageCard
                        item={entry.item}
                        busy={selectingId === entry.item.id}
                        disabled={Boolean(selectingId)}
                        onSelect={() => void handleSelectScryfall(entry.item)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <footer className="flex justify-end border-t-2 border-rpg-border px-4 py-3">
          <PixelButton type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </PixelButton>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function ScryfallImageCard({
  item,
  busy,
  disabled,
  onSelect,
}: {
  item: ScryfallCardImage;
  busy: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className="group flex w-full flex-col overflow-hidden border-2 border-rpg-border bg-rpg-parchment text-left transition-colors hover:border-rpg-gold-dark disabled:opacity-60"
    >
      <div className="relative aspect-square bg-rpg-panel">
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover p-1"
        />
        <span className="absolute left-1.5 top-1.5 border border-rpg-gold-dark bg-rpg-panel/95 px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase text-rpg-gold-dark">
          Scryfall
        </span>
      </div>
      <div className="border-t border-rpg-border px-2 py-2">
        <p className="truncate font-sans text-xs font-bold text-rpg-ink-dark">{item.name}</p>
        <p className="mt-0.5 truncate font-sans text-[10px] text-rpg-ink-faded">
          {busy ? 'Baixando…' : item.typeLine || item.setName || 'MTG'}
        </p>
      </div>
    </button>
  );
}

function MonsterImageCard({
  item,
  busy,
  disabled,
  onSelect,
}: {
  item: Open5eMonsterSummary;
  busy: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(item.imageUrl ?? null);
  const [previewLoading, setPreviewLoading] = useState(!item.imageUrl);

  useEffect(() => {
    if (item.imageUrl) {
      setPreviewUrl(item.imageUrl);
      setPreviewLoading(false);
      return;
    }

    let cancelled = false;
    setPreviewLoading(true);

    void resolveMonsterImageUrl(item.name, item.imageUrl)
      .then(url => {
        if (!cancelled) setPreviewUrl(url);
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [item.name, item.imageUrl]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className="group flex w-full flex-col overflow-hidden border-2 border-rpg-border bg-rpg-parchment text-left transition-colors hover:border-rpg-gold-dark disabled:opacity-60"
    >
      <div className="relative aspect-square bg-rpg-panel">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl opacity-40">
            {previewLoading ? '…' : '💀'}
          </div>
        )}
        <span className="absolute left-1.5 top-1.5 border border-rpg-mana bg-rpg-panel/95 px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase text-rpg-mana">
          {item.hasImage ? 'Open5e' : 'SRD'}
        </span>
      </div>
      <div className="border-t border-rpg-border px-2 py-2">
        <p className="truncate font-sans text-xs font-bold text-rpg-ink-dark">{item.name}</p>
        <p className="mt-0.5 truncate font-sans text-[10px] text-rpg-ink-faded">
          {busy
            ? 'Baixando…'
            : [item.type, item.challengeRating ? `CR ${item.challengeRating}` : null]
                .filter(Boolean)
                .join(' · ') || 'SRD'}
        </p>
      </div>
    </button>
  );
}
