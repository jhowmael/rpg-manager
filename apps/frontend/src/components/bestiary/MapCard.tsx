import { Edit, Eye, Trash2 } from 'lucide-react';
import type { CampaignMap } from '../../types/map';
import { EntityImage } from '../ui/EntityImage';
import { truncateText } from '../../utils/text';

interface MapCardProps {
  map: CampaignMap;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MapCard({ map, onView, onEdit, onDelete }: MapCardProps) {
  const excerpt = truncateText(map.descricao ?? '', 100);

  return (
    <article className="group flex h-full flex-col overflow-hidden border-2 border-rpg-border bg-rpg-parchment transition-all hover:border-rpg-gold-dark hover:shadow-pixel">
      <div className="aspect-[4/3] w-full shrink-0 overflow-hidden border-b-2 border-rpg-border bg-rpg-panel">
        <EntityImage
          imagemId={map.imagem_id}
          alt={map.nome}
          fallbackEmoji="🗺️"
        />
      </div>

      <button
        type="button"
        onClick={onView}
        className="flex min-h-0 flex-1 flex-col p-3 text-left"
      >
        <div className="mb-2 flex min-h-[1.375rem] flex-wrap gap-1">
          <span className="border border-rpg-mana/50 bg-rpg-mana/10 px-2 py-0.5 font-sans text-[10px] font-bold uppercase text-rpg-mana">
            Mapa
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[2.5rem] font-pixel text-[10px] leading-relaxed text-rpg-ink-dark group-hover:text-rpg-gold-dark sm:text-pixel-xs">
          {map.nome}
        </h3>

        <p
          className={[
            'mt-1 flex-1 font-sans text-xs leading-relaxed',
            excerpt ? 'text-rpg-ink-dim' : 'text-rpg-ink-faded',
          ].join(' ')}
        >
          {excerpt || 'Sem descrição.'}
        </p>
      </button>

      <div className="flex border-t-2 border-rpg-border">
        <button
          type="button"
          onClick={onView}
          className="flex flex-1 items-center justify-center gap-1 border-r-2 border-rpg-border py-2 font-sans text-xs text-rpg-ink-dim hover:bg-rpg-gold/10 hover:text-rpg-gold-dark"
        >
          <Eye size={12} />
          Ver
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1 border-r-2 border-rpg-border py-2 font-sans text-xs text-rpg-ink-dim hover:bg-rpg-gold/10 hover:text-rpg-gold-dark"
        >
          <Edit size={12} />
          Editar
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex flex-1 items-center justify-center gap-1 py-2 font-sans text-xs text-rpg-ink-dim hover:bg-rpg-hp/10 hover:text-rpg-hp"
        >
          <Trash2 size={12} />
          Excluir
        </button>
      </div>
    </article>
  );
}
