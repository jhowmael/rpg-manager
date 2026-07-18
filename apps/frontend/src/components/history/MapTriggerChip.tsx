import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { getEntityImageUrl } from '../../utils/entityImage';
import { ImageLightbox } from '../ui/ImageLightbox';

interface MapTriggerChipProps {
  mapId: string;
  nome: string;
  imagemId?: string | null;
}

export function MapTriggerChip({ mapId, nome, imagemId }: MapTriggerChipProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageUrl = getEntityImageUrl(imagemId ?? undefined);

  const openLightbox = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (imageUrl) setLightboxOpen(true);
  };

  return (
    <>
      <span
        className="map-trigger-chip my-2 flex flex-col overflow-hidden border-2 border-rpg-mana bg-rpg-mana/5"
        data-map-id={mapId}
        data-map-nome={nome}
        data-map-imagem-id={imagemId ?? ''}
        contentEditable={false}
      >
        {imageUrl ? (
          <button
            type="button"
            onClick={openLightbox}
            className="group relative cursor-zoom-in bg-rpg-parchment"
            title="Clique para ampliar o mapa"
          >
            <img
              src={imageUrl}
              alt={nome}
              className="max-h-72 w-full object-contain"
            />
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 border-2 border-rpg-border bg-rpg-panel/95 px-2 py-1 font-sans text-[10px] font-semibold text-rpg-ink-dark opacity-90 shadow-pixel transition-opacity group-hover:opacity-100">
              <Maximize2 size={12} />
              Ampliar
            </span>
          </button>
        ) : (
          <div className="flex h-32 items-center justify-center bg-rpg-parchment text-4xl">
            🗺️
          </div>
        )}
        <button
          type="button"
          onClick={openLightbox}
          disabled={!imageUrl}
          className="border-t-2 border-rpg-mana/40 px-3 py-1.5 text-left font-sans text-xs font-semibold text-rpg-mana transition-colors hover:bg-rpg-mana/10 disabled:cursor-default"
          title={imageUrl ? 'Clique para ampliar o mapa' : undefined}
        >
          🗺️ {nome}
        </button>
      </span>

      {lightboxOpen && imageUrl && (
        <ImageLightbox
          src={imageUrl}
          alt={nome}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
