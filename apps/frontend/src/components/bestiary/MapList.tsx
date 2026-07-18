import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Map, Plus, Search } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { Pagination } from '../ui/Pagination';
import { MapCard } from './MapCard';
import type { CampaignMap } from '../../types/map';

const ITEMS_PER_PAGE = 6;

interface MapListProps {
  maps: CampaignMap[];
  onCreate: () => void;
  onView: (map: CampaignMap) => void;
  onEdit: (map: CampaignMap) => void;
  onDelete: (id: string) => void;
}

export function MapList({ maps, onCreate, onView, onEdit, onDelete }: MapListProps) {
  return (
    <PaginatedMapSection
      title="Mapas"
      icon="🗺️"
      items={maps}
      emptyEmoji="🗺️"
      emptyMessage="Nenhum mapa cadastrado."
      emptyHint="Adicione mapas de regiões, dungeons e locais da campanha."
      filterEmptyMessage="Nenhum mapa encontrado para este filtro."
      createButton={
        <PixelButton variant="gold" onClick={onCreate}>
          <span className="flex items-center gap-2">
            <Plus size={14} />
            <Map size={14} />
            Novo Mapa
          </span>
        </PixelButton>
      }
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

function PaginatedMapSection({
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
  items: CampaignMap[];
  emptyEmoji: string;
  emptyMessage: string;
  emptyHint: string;
  filterEmptyMessage: string;
  createButton: ReactNode;
  onView: (map: CampaignMap) => void;
  onEdit: (map: CampaignMap) => void;
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
        (item.descricao?.toLowerCase().includes(query) ?? false),
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
            placeholder="Filtrar por nome ou descrição..."
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
            {paginated.map(map => (
              <li key={map.id} className="h-full">
                <MapCard
                  map={map}
                  onView={() => onView(map)}
                  onEdit={() => onEdit(map)}
                  onDelete={() => onDelete(map.id)}
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
