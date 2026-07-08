import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Plus, Search, Skull, User } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { Pagination } from '../ui/Pagination';
import { CharacterCard } from './CharacterCard';
import type { Character } from '../../types/character';

const ITEMS_PER_PAGE = 6;

interface CharacterListProps {
  npcs: Character[];
  mobs: Character[];
  onCreateNpc: () => void;
  onCreateMob: () => void;
  onView: (character: Character) => void;
  onEdit: (character: Character) => void;
  onDelete: (id: string) => void;
}

export function CharacterList({
  npcs,
  mobs,
  onCreateNpc,
  onCreateMob,
  onView,
  onEdit,
  onDelete,
}: CharacterListProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="text-2xl">📖</span>
          <h1 className="pixel-title">GRIMÓRIO</h1>
          <span className="text-2xl">📖</span>
        </div>
        <p className="font-sans text-base text-rpg-ink-dim">
          NPCs, mobs e criaturas da campanha
        </p>
      </header>

      <PaginatedCharacterSection
        title="NPCs"
        icon="👤"
        items={npcs}
        emptyEmoji="👤"
        emptyMessage="Nenhum NPC cadastrado."
        emptyHint="Adicione moradores, aliados e vilões da campanha."
        filterEmptyMessage="Nenhum NPC encontrado para este filtro."
        createButton={
          <PixelButton variant="forest" onClick={onCreateNpc}>
            <span className="flex items-center gap-2">
              <Plus size={14} />
              <User size={14} />
              Novo NPC
            </span>
          </PixelButton>
        }
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <PaginatedCharacterSection
        title="Mobs & Criaturas"
        icon="💀"
        items={mobs}
        emptyEmoji="💀"
        emptyMessage="Nenhum mob cadastrado."
        emptyHint="Registre monstros, bandos e criaturas hostis."
        filterEmptyMessage="Nenhum mob encontrado para este filtro."
        createButton={
          <PixelButton variant="hp" onClick={onCreateMob}>
            <span className="flex items-center gap-2">
              <Plus size={14} />
              <Skull size={14} />
              Novo Mob
            </span>
          </PixelButton>
        }
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

function PaginatedCharacterSection({
  title,
  icon,
  items,
  emptyEmoji,
  emptyMessage,
  emptyHint,
  filterEmptyMessage,
  createButton,
  onView,
  onEdit,
  onDelete,
}: {
  title: string;
  icon: string;
  items: Character[];
  emptyEmoji: string;
  emptyMessage: string;
  emptyHint: string;
  filterEmptyMessage: string;
  createButton: ReactNode;
  onView: (character: Character) => void;
  onEdit: (character: Character) => void;
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      item =>
        item.nome.toLowerCase().includes(query) ||
        (item.historia?.toLowerCase().includes(query) ?? false),
    );
  }, [items, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <PixelCard title={title} icon={icon}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rpg-ink-faded"
          />
          <input
            type="search"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filtrar por nome ou história..."
            className="pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment py-2 pl-9 pr-3 font-sans text-sm text-rpg-ink outline-none placeholder:text-rpg-ink-faded focus:border-rpg-gold"
          />
        </div>
        {createButton}
      </div>

      {items.length === 0 ? (
        <EmptyState emoji={emptyEmoji} message={emptyMessage} hint={emptyHint} />
      ) : filtered.length === 0 ? (
        <EmptyState emoji="🔍" message={filterEmptyMessage} hint="Tente outro termo de busca." />
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map(character => (
              <li key={character.id}>
                <CharacterCard
                  character={character}
                  onView={() => onView(character)}
                  onEdit={() => onEdit(character)}
                  onDelete={() => onDelete(character.id)}
                />
              </li>
            ))}
          </ul>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={setPage}
          />
        </>
      )}
    </PixelCard>
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
