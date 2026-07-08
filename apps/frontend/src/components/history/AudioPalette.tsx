import { Music, Volume2 } from 'lucide-react';
import {
  AUDIO_DRAG_TYPE,
  MUSIC_LIBRARY,
  SFX_LIBRARY,
  type AudioDragPayload,
  type AudioItem,
} from '../../data/soundLibrary';
import { playAudio } from '../../hooks/useAudioPlayer';

interface AudioPaletteProps {
  onInsert: (payload: AudioDragPayload) => void;
  variant?: 'default' | 'sidebar';
  embedded?: boolean;
}

export function AudioPalette({
  onInsert,
  variant = 'default',
  embedded = false,
}: AudioPaletteProps) {
  const isCompact = embedded || variant === 'sidebar';

  if (embedded) {
    return (
      <div className="flex flex-col gap-4">
        <PaletteSection
          icon={<Volume2 size={12} />}
          title="Efeitos sonoros"
          hint="2x clique = ouvir"
        >
          <div className="grid grid-cols-2 gap-1.5">
            {SFX_LIBRARY.map(item => (
              <PaletteChip key={item.id} item={item} onInsert={onInsert} compact />
            ))}
          </div>
        </PaletteSection>

        <PaletteSection
          icon={<Music size={12} />}
          title="Músicas & ambiente"
          hint="loop no texto"
        >
          <div className="flex flex-col gap-1.5">
            {MUSIC_LIBRARY.map(item => (
              <PaletteChip key={item.id} item={item} onInsert={onInsert} row />
            ))}
          </div>
        </PaletteSection>
      </div>
    );
  }

  const chipLayout = isCompact ? 'flex flex-col gap-1.5' : 'flex flex-wrap gap-2';

  return (
    <div className="flex flex-col gap-3 border-2 border-rpg-border bg-rpg-panel p-3 shadow-pixel">
      <div>
        <p className="pixel-label mb-2 flex items-center gap-2">
          <Volume2 size={14} />
          Efeitos Sonoros
        </p>
        <div className={chipLayout}>
          {SFX_LIBRARY.map(item => (
            <PaletteChip
              key={item.id}
              item={item}
              onInsert={onInsert}
              fullWidth={isCompact}
            />
          ))}
        </div>
      </div>

      <div className="border-t-2 border-dashed border-rpg-border pt-3">
        <p className="pixel-label mb-2 flex items-center gap-2">
          <Music size={14} />
          Músicas & Ambiente
        </p>
        <div className={chipLayout}>
          {MUSIC_LIBRARY.map(item => (
            <PaletteChip
              key={item.id}
              item={item}
              onInsert={onInsert}
              fullWidth={isCompact}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PaletteSection({
  icon,
  title,
  hint,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-1.5 border-b border-rpg-border/60 pb-1.5">
        <span className="text-rpg-ink-dim">{icon}</span>
        <span className="font-sans text-[10px] font-bold uppercase tracking-wide text-rpg-ink-dim">
          {title}
        </span>
        <span className="ml-auto font-sans text-[9px] text-rpg-ink-faded">{hint}</span>
      </div>
      {children}
    </section>
  );
}

function PaletteChip({
  item,
  onInsert,
  fullWidth,
  compact,
  row,
}: {
  item: AudioItem;
  onInsert: (payload: AudioDragPayload) => void;
  fullWidth?: boolean;
  compact?: boolean;
  row?: boolean;
}) {
  const isMusic = item.category === 'music';

  const payload: AudioDragPayload = {
    audioId: item.id,
    category: item.category,
    label: item.label,
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(AUDIO_DRAG_TYPE, JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  if (compact) {
    return (
      <button
        type="button"
        draggable
        onDragStart={handleDragStart}
        onClick={() => onInsert(payload)}
        onDoubleClick={() => playAudio(item.id)}
        title={`${item.label} — arraste ou clique. Duplo clique para pré-ouvir.`}
        className={[
          'group flex min-h-[3.75rem] cursor-grab flex-col items-center justify-center gap-0.5 border-2 px-1 py-1.5 transition-all active:cursor-grabbing',
          'border-rpg-gold-dark/40 bg-rpg-gold/5 text-rpg-gold-dark hover:border-rpg-gold-dark hover:bg-rpg-gold/15',
        ].join(' ')}
      >
        <span className="text-base leading-none">{item.emoji}</span>
        <span className="w-full truncate px-0.5 text-center font-sans text-[9px] font-semibold leading-tight">
          {item.label}
        </span>
      </button>
    );
  }

  if (row) {
    return (
      <button
        type="button"
        draggable
        onDragStart={handleDragStart}
        onClick={() => onInsert(payload)}
        onDoubleClick={() => playAudio(item.id)}
        title={`${item.label} — arraste ou clique. Duplo clique para pré-ouvir.`}
        className={[
          'flex w-full cursor-grab items-center gap-2 border-2 px-2 py-2 text-left transition-all active:cursor-grabbing',
          'border-rpg-mana/50 bg-rpg-mana/5 text-rpg-mana hover:border-rpg-mana hover:bg-rpg-mana/15',
        ].join(' ')}
      >
        <span className="text-sm leading-none">{item.emoji}</span>
        <span className="min-w-0 flex-1 truncate font-sans text-[11px] font-semibold">
          {item.label}
        </span>
        <Music size={10} className="shrink-0 opacity-50" />
      </button>
    );
  }

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onInsert(payload)}
      onDoubleClick={() => playAudio(item.id)}
      title={`${item.label} — arraste ou clique. Duplo clique para pré-ouvir.`}
      className={[
        'cursor-grab border-2 px-2 py-1.5 font-sans text-xs font-semibold transition-all active:cursor-grabbing',
        fullWidth ? 'w-full text-left' : '',
        isMusic
          ? 'border-rpg-mana/50 bg-rpg-mana/5 text-rpg-mana hover:border-rpg-mana hover:bg-rpg-mana/15'
          : 'border-rpg-gold-dark/50 bg-rpg-gold/5 text-rpg-gold-dark hover:border-rpg-gold-dark hover:bg-rpg-gold/15',
      ].join(' ')}
    >
      <span className="mr-1">{item.emoji}</span>
      {item.label}
    </button>
  );
}
