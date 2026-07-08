import { Skull, User } from 'lucide-react';
import {
  CHARACTER_DRAG_TYPE,
  type CharacterDragPayload,
} from '../../data/mockCharacters';
import type { Character } from '../../types/character';
import { useCharacterNavigationOptional } from '../../context/CharacterNavigationContext';

interface CharacterPaletteProps {
  characters: Character[];
  onInsert: (payload: CharacterDragPayload) => void;
  variant?: 'default' | 'sidebar';
  embedded?: boolean;
}

export function CharacterPalette({
  characters,
  onInsert,
  variant = 'default',
  embedded = false,
}: CharacterPaletteProps) {
  const navigation = useCharacterNavigationOptional();
  const npcs = characters.filter(c => c.tipo === 'NPC');
  const mobs = characters.filter(c => c.tipo === 'MOB');
  const isCompact = embedded || variant === 'sidebar';
  const chipLayout = isCompact ? 'flex flex-col gap-1' : 'flex flex-wrap gap-2';

  if (characters.length === 0) {
    const empty = (
      <p className="py-2 text-center font-sans text-[10px] text-rpg-ink-faded">
        Nenhum NPC/Mob no grimório.
      </p>
    );

    if (embedded) {
      return (
        <section>
          <SectionHeader icon={<User size={12} />} title="Personagens" hint="2x clique = ficha" />
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
    <>
      {(npcs.length > 0 || !embedded) && (
        <div>
          {!embedded && (
            <p className="pixel-label mb-2 flex items-center gap-2">
              <User size={14} />
              NPCs
            </p>
          )}
          {embedded && npcs.length > 0 && (
            <p className="mb-1 font-sans text-[9px] font-bold uppercase tracking-wide text-rpg-forest/80">
              NPCs
            </p>
          )}
          <div className={chipLayout}>
            {npcs.map(character => (
              <CharacterPaletteChip
                key={character.id}
                character={character}
                onInsert={onInsert}
                onPreview={() => navigation?.openCharacter(character.id)}
                compact={isCompact}
              />
            ))}
            {npcs.length === 0 && !embedded && (
              <span className="font-sans text-xs text-rpg-ink-faded">Nenhum NPC.</span>
            )}
          </div>
        </div>
      )}

      {(mobs.length > 0 || !embedded) && (
        <div className={embedded && npcs.length > 0 ? 'mt-2.5' : embedded ? '' : 'border-t-2 border-dashed border-rpg-border pt-3'}>
          {!embedded && (
            <p className="pixel-label mb-2 flex items-center gap-2">
              <Skull size={14} />
              Mobs
            </p>
          )}
          {embedded && mobs.length > 0 && (
            <p className="mb-1 font-sans text-[9px] font-bold uppercase tracking-wide text-rpg-hp/80">
              Mobs
            </p>
          )}
          <div className={chipLayout}>
            {mobs.map(character => (
              <CharacterPaletteChip
                key={character.id}
                character={character}
                onInsert={onInsert}
                onPreview={() => navigation?.openCharacter(character.id)}
                compact={isCompact}
              />
            ))}
            {mobs.length === 0 && !embedded && (
              <span className="font-sans text-xs text-rpg-ink-faded">Nenhum Mob.</span>
            )}
          </div>
        </div>
      )}
    </>
  );

  if (embedded) {
    return (
      <section>
        <SectionHeader icon={<User size={12} />} title="Personagens" hint="2x clique = ficha" />
        {content}
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-3 border-2 border-rpg-border bg-rpg-panel p-3 shadow-pixel">
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

function CharacterPaletteChip({
  character,
  onInsert,
  onPreview,
  compact,
}: {
  character: Character;
  onInsert: (payload: CharacterDragPayload) => void;
  onPreview: () => void;
  compact?: boolean;
}) {
  const isMob = character.tipo === 'MOB';
  const payload: CharacterDragPayload = {
    characterId: character.id,
    nome: character.nome,
    tipo: character.tipo,
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(CHARACTER_DRAG_TYPE, JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onInsert(payload)}
      onDoubleClick={onPreview}
      title={`${character.nome} — arraste ou clique. Duplo clique para ver ficha.`}
      className={[
        'cursor-grab border-2 font-sans font-semibold transition-all active:cursor-grabbing',
        compact ? 'flex w-full items-center gap-2 px-2 py-1.5 text-left text-[11px]' : 'px-2 py-1.5 text-xs',
        isMob
          ? 'border-rpg-hp/50 bg-rpg-hp/5 text-rpg-hp hover:border-rpg-hp hover:bg-rpg-hp/15'
          : 'border-rpg-forest/50 bg-rpg-forest/5 text-rpg-forest hover:border-rpg-forest hover:bg-rpg-forest/15',
      ].join(' ')}
    >
      <span className="shrink-0 text-sm leading-none">{isMob ? '💀' : '👤'}</span>
      <span className="min-w-0 truncate">{character.nome}</span>
    </button>
  );
}
