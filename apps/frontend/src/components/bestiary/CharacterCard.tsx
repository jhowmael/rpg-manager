import { Edit, Eye, Trash2 } from 'lucide-react';
import type { Character } from '../../types/character';
import { EntityImage } from '../ui/EntityImage';
import { truncateText } from '../../utils/text';

interface CharacterCardProps {
  character: Character;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CharacterCard({ character, onView, onEdit, onDelete }: CharacterCardProps) {
  const isMob = character.tipo === 'MOB';
  const excerpt = truncateText(character.historia ?? '', 100);

  return (
    <article className="group flex h-full flex-col overflow-hidden border-2 border-rpg-border bg-rpg-parchment transition-all hover:border-rpg-gold-dark hover:shadow-pixel">
      <div className="aspect-square w-full shrink-0 overflow-hidden border-b-2 border-rpg-border bg-rpg-panel">
        <EntityImage
          imagemId={character.imagem_id}
          alt={character.nome}
          fallbackEmoji={isMob ? '💀' : '👤'}
        />
      </div>

      <button
        type="button"
        onClick={onView}
        className="flex min-h-0 flex-1 flex-col p-3 text-left"
      >
        <div className="mb-2 flex min-h-[1.375rem] flex-wrap gap-1">
          <span
            className={[
              'border px-2 py-0.5 font-sans text-[10px] font-bold uppercase',
              isMob
                ? 'border-rpg-hp/50 bg-rpg-hp/10 text-rpg-hp'
                : 'border-rpg-forest/50 bg-rpg-forest/10 text-rpg-forest',
            ].join(' ')}
          >
            {character.tipo}
          </span>
          {character.raca && (
            <span className="border border-rpg-gold-dark/50 bg-rpg-gold/10 px-2 py-0.5 font-sans text-[10px] font-bold text-rpg-gold-dark">
              {character.raca}
            </span>
          )}
          {character.classe && (
            <span className="border border-rpg-mana/50 bg-rpg-mana/10 px-2 py-0.5 font-sans text-[10px] font-bold text-rpg-mana">
              {character.classe}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[2.5rem] font-pixel text-[10px] leading-relaxed text-rpg-ink-dark group-hover:text-rpg-gold-dark sm:text-pixel-xs">
          {character.nome}
        </h3>

        <p
          className={[
            'mt-0.5 min-h-[1rem] font-sans text-[11px] font-semibold leading-snug',
            character.titulo ? 'text-rpg-gold-dark' : 'text-transparent',
          ].join(' ')}
        >
          {character.titulo || '—'}
        </p>

        <p className="mt-2 line-clamp-3 min-h-[3.75rem] font-sans text-xs leading-relaxed text-rpg-ink-faded">
          {excerpt || 'Sem história registrada.'}
        </p>
      </button>

      <div className="mt-auto flex shrink-0 border-t-2 border-rpg-border">
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
