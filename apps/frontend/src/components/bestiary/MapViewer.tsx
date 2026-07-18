import { useState } from 'react';
import { ArrowLeft, Edit, Maximize2 } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { EntityImage } from '../ui/EntityImage';
import { ImageLightbox } from '../ui/ImageLightbox';
import { getEntityImageUrl } from '../../utils/entityImage';
import type { CampaignMap } from '../../types/map';

interface MapViewerProps {
  map: CampaignMap;
  onBack: () => void;
  onEdit: () => void;
}

export function MapViewer({ map, onBack, onEdit }: MapViewerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageUrl = getEntityImageUrl(map.imagem_id);

  return (
    <div className="mx-auto max-w-5xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar para o grimório
      </button>

      <header className="mb-6 overflow-hidden border-2 border-rpg-border bg-rpg-panel shadow-pixel">
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-rpg-border bg-rpg-parchment sm:aspect-[16/9] sm:min-h-[28rem]">
          <EntityImage
            imagemId={map.imagem_id}
            alt={map.nome}
            fallbackEmoji="🗺️"
            fallbackClassName="text-6xl"
            containerClassName="h-full min-h-[16rem] w-full"
            enableLightbox={false}
            onImageClick={() => {
              if (imageUrl) setLightboxOpen(true);
            }}
          />

          {imageUrl && (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-3 right-3 inline-flex items-center gap-2 border-2 border-rpg-border bg-rpg-panel/95 px-3 py-2 font-sans text-xs font-semibold text-rpg-ink-dark shadow-pixel transition-colors hover:border-rpg-gold-dark hover:bg-rpg-gold/15"
            >
              <Maximize2 size={14} />
              Ampliar mapa
            </button>
          )}
        </div>
        <div className="p-6">
          <p className="pixel-subtitle mb-2">🗺️ MAPA</p>
          <h1 className="pixel-title mb-2">{map.nome}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-block w-fit border border-rpg-mana bg-rpg-mana/10 px-3 py-1 font-sans text-xs font-bold uppercase text-rpg-mana">
              Mapa
            </span>
            {imageUrl && (
              <span className="font-sans text-xs text-rpg-ink-faded">
                Clique na imagem para ampliar e usar zoom
              </span>
            )}
          </div>
        </div>
      </header>

      {map.descricao && (
        <section className="mb-6 border-2 border-rpg-border bg-rpg-parchment p-5 shadow-pixel">
          <h2 className="pixel-label mb-3">Descrição</h2>
          <p className="whitespace-pre-wrap font-sans text-base leading-relaxed text-rpg-ink-dark">
            {map.descricao}
          </p>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {imageUrl && (
          <PixelButton variant="forest" onClick={() => setLightboxOpen(true)}>
            <span className="flex items-center gap-2">
              <Maximize2 size={14} />
              Ver em tela cheia
            </span>
          </PixelButton>
        )}
        <PixelButton variant="gold" onClick={onEdit}>
          <span className="flex items-center gap-2">
            <Edit size={14} />
            Editar mapa
          </span>
        </PixelButton>
        <PixelButton variant="ghost" onClick={onBack}>
          Voltar
        </PixelButton>
      </div>

      {lightboxOpen && imageUrl && (
        <ImageLightbox
          src={imageUrl}
          alt={map.nome}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
