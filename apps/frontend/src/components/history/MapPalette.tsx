import { useState } from 'react';
import { Eye, Map } from 'lucide-react';
import { MAP_DRAG_TYPE, type MapDragPayload } from '../../data/mapDrag';
import { getEntityImageUrl } from '../../utils/entityImage';
import { ImageLightbox } from '../ui/ImageLightbox';
import type { CampaignMap } from '../../types/map';

interface MapPaletteProps {
  maps: CampaignMap[];
  onInsert: (payload: MapDragPayload) => void;
  variant?: 'default' | 'sidebar';
  embedded?: boolean;
}

export function MapPalette({
  maps,
  onInsert,
  variant = 'default',
  embedded = false,
}: MapPaletteProps) {
  const isCompact = embedded || variant === 'sidebar';
  const chipLayout = isCompact ? 'flex flex-col gap-1.5' : 'flex flex-wrap gap-2';

  if (maps.length === 0) {
    const empty = (
      <p className="py-2 text-center font-sans text-[10px] text-rpg-ink-faded">
        Nenhum mapa no grimório.
      </p>
    );

    if (embedded) {
      return (
        <section>
          <SectionHeader icon={<Map size={12} />} title="Mapas" hint="olho = ampliar" />
          {empty}
        </section>
      );
    }

    return (
      <div className="border-2 border-dashed border-rpg-border bg-rpg-panel p-3 text-center">
        {empty}
      </div>
    );
  }

  const content = (
    <div className={chipLayout}>
      {maps.map(map => (
        <MapPaletteChip
          key={map.id}
          map={map}
          onInsert={onInsert}
          compact={isCompact}
        />
      ))}
    </div>
  );

  if (embedded) {
    return (
      <section>
        <SectionHeader icon={<Map size={12} />} title="Mapas" hint="olho = ampliar" />
        {content}
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-3 border-2 border-rpg-border bg-rpg-panel p-3 shadow-pixel">
      <p className="pixel-label mb-2 flex items-center gap-2">
        <Map size={14} />
        Mapas
      </p>
      {content}
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-1.5 border-b border-rpg-border/60 pb-1.5">
      <span className="text-rpg-ink-dim">{icon}</span>
      <span className="font-sans text-[10px] font-bold uppercase tracking-wide text-rpg-ink-dim">
        {title}
      </span>
      <span className="ml-auto font-sans text-[9px] text-rpg-ink-faded">{hint}</span>
    </div>
  );
}

function MapPaletteChip({
  map,
  onInsert,
  compact,
}: {
  map: CampaignMap;
  onInsert: (payload: MapDragPayload) => void;
  compact?: boolean;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageUrl = getEntityImageUrl(map.imagem_id);

  const payload: MapDragPayload = {
    mapId: map.id,
    nome: map.nome,
    imagemId: map.imagem_id,
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(MAP_DRAG_TYPE, JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const openPreview = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (imageUrl) setLightboxOpen(true);
  };

  return (
    <>
      <div
        className={[
          'border-2 border-rpg-mana/50 bg-rpg-mana/5 transition-all hover:border-rpg-mana hover:bg-rpg-mana/15',
          compact ? 'overflow-hidden' : '',
        ].join(' ')}
      >
        {compact && imageUrl && (
          <button
            type="button"
            onClick={openPreview}
            className="block w-full cursor-zoom-in border-b border-rpg-mana/30 bg-rpg-parchment"
            title={`Ampliar ${map.nome}`}
          >
            <img
              src={imageUrl}
              alt={map.nome}
              className="h-20 w-full object-cover object-center"
            />
          </button>
        )}

        <div className={compact ? 'flex items-stretch' : 'flex items-center'}>
          <button
            type="button"
            draggable
            onDragStart={handleDragStart}
            onClick={() => onInsert(payload)}
            onDoubleClick={openPreview}
            title={`${map.nome} — clique para inserir. Duplo clique ou olho para ampliar.`}
            className={[
              'min-w-0 flex-1 cursor-grab font-sans font-semibold text-rpg-mana active:cursor-grabbing',
              compact
                ? 'flex items-center gap-2 px-2 py-1.5 text-left text-[11px]'
                : 'px-2 py-1.5 text-xs',
            ].join(' ')}
          >
            <span className="shrink-0 text-sm leading-none">🗺️</span>
            <span className="min-w-0 truncate">{map.nome}</span>
          </button>

          <button
            type="button"
            onClick={openPreview}
            disabled={!imageUrl}
            title={imageUrl ? `Ampliar ${map.nome}` : 'Mapa sem imagem'}
            className="flex shrink-0 items-center justify-center border-l border-rpg-mana/30 px-2 text-rpg-mana transition-colors hover:bg-rpg-mana/20 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {lightboxOpen && imageUrl && (
        <ImageLightbox
          src={imageUrl}
          alt={map.nome}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
