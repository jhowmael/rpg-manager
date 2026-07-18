import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { PixelButton } from './PixelButton';
import {
  importOpen5eMonsterSheet,
  searchOpen5eMonsters,
  type Open5eMonsterSummary,
  type Open5eSheetImport,
} from '../../services/open5eService';

interface Open5eMonsterImportPickerProps {
  open: boolean;
  onClose: () => void;
  onImport: (sheet: Open5eSheetImport) => void | Promise<void>;
}

export function Open5eMonsterImportPicker({
  open,
  onClose,
  onImport,
}: Open5eMonsterImportPickerProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [items, setItems] = useState<Open5eMonsterSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [importingSlug, setImportingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
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

    void searchOpen5eMonsters(debouncedQuery)
      .then(results => {
        if (!cancelled) setItems(results);
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setError('Falha ao carregar monstros da Open5e.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, debouncedQuery]);

  if (!open) return null;

  const handleImport = async (item: Open5eMonsterSummary) => {
    setImportingSlug(item.slug);
    setError(null);
    try {
      const sheet = await importOpen5eMonsterSheet(item.slug);
      await onImport(sheet);
      onClose();
    } catch {
      setError('Não foi possível importar esta ficha.');
    } finally {
      setImportingSlug(null);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-rpg-void/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Importar ficha Open5e"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(90dvh,42rem)] w-full max-w-3xl flex-col overflow-hidden border-2 border-rpg-border bg-rpg-panel shadow-pixel"
        onClick={event => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b-2 border-rpg-border bg-rpg-parchment/70 px-4 py-3">
          <div>
            <p className="pixel-label mb-1">Open5e</p>
            <h2 className="font-pixel text-[11px] leading-relaxed text-rpg-ink-dark sm:text-pixel-xs">
              Importar ficha
            </h2>
            <p className="mt-1 font-sans text-[11px] text-rpg-ink-faded">
              Preenche nome, atributos, CA, vida, habilidades e características do SRD.
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
              placeholder="Buscar monstro (ex: goblin, adult red dragon)…"
              className="min-w-0 flex-1 bg-transparent font-sans text-sm text-rpg-ink outline-none"
              autoFocus
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {loading && (
            <p className="py-10 text-center font-sans text-sm text-rpg-ink-faded">
              Buscando no SRD…
            </p>
          )}

          {!loading && error && (
            <p className="py-6 text-center font-sans text-sm text-rpg-hp">{error}</p>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="py-10 text-center font-sans text-sm text-rpg-ink-faded">
              Nenhum monstro encontrado. Tente outro nome.
            </p>
          )}

          {!loading && items.length > 0 && (
            <ul className="flex flex-col gap-2">
              {items.map(item => {
                const busy = importingSlug === item.slug;
                return (
                  <li key={item.slug}>
                    <button
                      type="button"
                      disabled={Boolean(importingSlug)}
                      onClick={() => void handleImport(item)}
                      className="flex w-full items-center gap-3 border-2 border-rpg-border bg-rpg-parchment px-3 py-2.5 text-left transition-colors hover:border-rpg-gold-dark disabled:opacity-60"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-rpg-border bg-rpg-panel">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-lg opacity-50">💀</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-sm font-bold text-rpg-ink-dark">
                          {item.name}
                        </p>
                        <p className="mt-0.5 truncate font-sans text-[11px] text-rpg-ink-faded">
                          {[
                            item.type,
                            item.size,
                            item.challengeRating ? `CR ${item.challengeRating}` : null,
                            item.hitPoints != null ? `HP ${item.hitPoints}` : null,
                            item.armorClass != null ? `CA ${item.armorClass}` : null,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                      <span className="shrink-0 font-sans text-[10px] font-semibold uppercase text-rpg-mana">
                        {busy ? 'Importando…' : 'Usar'}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
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
