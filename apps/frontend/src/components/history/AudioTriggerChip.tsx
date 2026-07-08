import { useEffect, useState } from 'react';
import { Music, Volume2 } from 'lucide-react';
import type { AudioCategory } from '../../data/soundLibrary';
import { isMusicPlaying, playAudio } from '../../hooks/useAudioPlayer';

interface AudioTriggerChipProps {
  audioId: string;
  category: AudioCategory;
  label: string;
}

export function AudioTriggerChip({ audioId, category, label }: AudioTriggerChipProps) {
  const [playing, setPlaying] = useState(false);
  const isMusic = category === 'music';
  const item = { audioId, category, label };

  useEffect(() => {
    const reset = () => setPlaying(false);
    window.addEventListener('rpg-audio-stopped', reset);
    return () => window.removeEventListener('rpg-audio-stopped', reset);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playAudio(audioId);
    if (isMusic) {
      setPlaying(isMusicPlaying(audioId));
      setTimeout(() => setPlaying(isMusicPlaying(audioId)), 100);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isMusic ? `Tocar/Parar: ${label}` : `Tocar: ${label}`}
      className={[
        'audio-trigger-chip mx-0.5 inline-flex items-center gap-1 border-2 px-2 py-0.5 font-sans text-xs font-semibold transition-all',
        isMusic
          ? 'border-rpg-mana bg-rpg-mana/10 text-rpg-mana hover:bg-rpg-mana/20'
          : 'border-rpg-gold-dark bg-rpg-gold/15 text-rpg-gold-dark hover:bg-rpg-gold/25',
        playing && isMusic ? 'ring-2 ring-rpg-mana/40' : '',
      ].join(' ')}
      data-audio-id={item.audioId}
      data-audio-category={item.category}
      data-audio-label={item.label}
    >
      {isMusic ? <Music size={12} /> : <Volume2 size={12} />}
      <span>{label}</span>
    </button>
  );
}
