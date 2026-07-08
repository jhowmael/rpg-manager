import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-rpg-border pt-4">
      <p className="font-sans text-xs text-rpg-ink-faded">
        {from}–{to} de {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 border-2 border-rpg-border bg-rpg-panel px-2 py-1 font-sans text-xs text-rpg-ink-dim transition-colors hover:border-rpg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} />
          Anterior
        </button>
        <span className="font-sans text-xs text-rpg-ink-dim">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 border-2 border-rpg-border bg-rpg-panel px-2 py-1 font-sans text-xs text-rpg-ink-dim transition-colors hover:border-rpg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Próxima
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
