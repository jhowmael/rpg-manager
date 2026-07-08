import { ArrowLeft, Edit } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { EntityImage } from '../ui/EntityImage';
import type { Hero } from '../../types/hero';

interface HeroViewerProps {
  hero: Hero;
  onBack: () => void;
  onEdit: () => void;
}

export function HeroViewer({ hero, onBack, onEdit }: HeroViewerProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar para heróis
      </button>

      <header className="mb-6 overflow-hidden border-2 border-rpg-border bg-rpg-panel shadow-pixel">
        <div className="flex flex-col sm:flex-row">
          <div className="aspect-square w-full shrink-0 overflow-hidden border-b-2 border-rpg-border bg-rpg-parchment sm:w-48 sm:border-b-0 sm:border-r-2">
            <EntityImage
              imagemId={hero.imagem_id}
              alt={hero.nome}
              fallbackEmoji="🛡️"
              fallbackClassName="text-6xl"
              containerClassName="h-full min-h-[12rem] w-full sm:min-h-0"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center p-6">
            <p className="pixel-subtitle mb-2">🛡️ HERÓI / JOGADOR</p>
            <h1 className="pixel-title mb-3">{hero.nome}</h1>
            <div className="flex flex-wrap gap-2">
              <span className="border border-rpg-mana/50 bg-rpg-mana/10 px-3 py-1 font-sans text-xs font-bold text-rpg-mana">
                {hero.classe}
              </span>
              <span className="border border-rpg-gold-dark/50 bg-rpg-gold/10 px-3 py-1 font-sans text-xs font-bold text-rpg-gold-dark">
                {hero.raca}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="border-2 border-rpg-border bg-rpg-parchment p-5 shadow-pixel">
        <h2 className="pixel-card-title mb-3 flex items-center gap-2">
          <span>📖</span>
          História
        </h2>
        <p className="whitespace-pre-wrap font-sans text-base leading-relaxed text-rpg-ink-dim">
          {hero.historia || 'Sem história registrada.'}
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <PixelButton variant="gold" onClick={onEdit}>
          <span className="flex items-center gap-2">
            <Edit size={14} />
            Editar
          </span>
        </PixelButton>
        <PixelButton variant="ghost" onClick={onBack}>
          Voltar
        </PixelButton>
      </div>
    </div>
  );
}
