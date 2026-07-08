import { Edit, Eye, Trash2 } from 'lucide-react';
import type { Hero } from '../../types/hero';
import { EntityImage } from '../ui/EntityImage';
import { truncateText } from '../../utils/text';

interface HeroCardProps {
  hero: Hero;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HeroCard({ hero, onView, onEdit, onDelete }: HeroCardProps) {
  const excerpt = truncateText(hero.historia ?? '', 100);

  return (
    <article className="group flex flex-col overflow-hidden border-2 border-rpg-border bg-rpg-parchment transition-all hover:border-rpg-gold-dark hover:shadow-pixel">
      <div className="aspect-square w-full overflow-hidden border-b-2 border-rpg-border bg-rpg-panel">
        <EntityImage imagemId={hero.imagem_id} alt={hero.nome} fallbackEmoji="🛡️" />
      </div>

      <button type="button" onClick={onView} className="block w-full p-3 text-left">
        <div className="mb-2 flex flex-wrap gap-1">
          <span className="border border-rpg-mana/50 bg-rpg-mana/10 px-2 py-0.5 font-sans text-[10px] font-bold text-rpg-mana">
            {hero.classe}
          </span>
          <span className="border border-rpg-gold-dark/50 bg-rpg-gold/10 px-2 py-0.5 font-sans text-[10px] font-bold text-rpg-gold-dark">
            {hero.raca}
          </span>
        </div>
        <h3 className="font-pixel text-[10px] leading-relaxed text-rpg-ink-dark group-hover:text-rpg-gold-dark sm:text-pixel-xs">
          {hero.nome}
        </h3>
        <p className="mt-1 font-sans text-xs leading-relaxed text-rpg-ink-faded">
          {excerpt || 'Sem história registrada.'}
        </p>
      </button>

      <div className="mt-auto flex border-t-2 border-rpg-border">
        <ActionButton title="Visualizar" onClick={onView} className="text-rpg-forest hover:bg-rpg-forest/10">
          <Eye size={14} />
        </ActionButton>
        <ActionButton
          title="Editar"
          onClick={onEdit}
          className="border-x-2 border-rpg-border text-rpg-ink-dim hover:bg-rpg-gold/10"
        >
          <Edit size={14} />
        </ActionButton>
        <ActionButton title="Excluir" onClick={onDelete} className="text-rpg-hp hover:bg-rpg-hp/10">
          <Trash2 size={14} />
        </ActionButton>
      </div>
    </article>
  );
}

function ActionButton({
  title,
  onClick,
  className,
  children,
}: {
  title: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={['flex flex-1 items-center justify-center py-2 transition-colors', className].join(' ')}
    >
      {children}
    </button>
  );
}
