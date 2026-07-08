import { useEffect, useState } from 'react';
import { VolumeX } from 'lucide-react';
import { isAnyAudioPlaying, stopAllAudio } from '../../hooks/useAudioPlayer';

export function StopAllAudioButton() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const sync = () => setIsPlaying(isAnyAudioPlaying());

    const interval = setInterval(sync, 400);
    window.addEventListener('rpg-audio-stopped', sync);

    return () => {
      clearInterval(interval);
      window.removeEventListener('rpg-audio-stopped', sync);
    };
  }, []);

  const handleStop = () => {
    stopAllAudio();
    setIsPlaying(false);
  };

  return (
    <button
      type="button"
      onClick={handleStop}
      title="Parar todos os sons em reprodução"
      className={[
        'fixed bottom-6 right-6 z-50 flex items-center gap-2 border-2 px-3 py-2 font-sans text-xs font-semibold shadow-pixel backdrop-blur-sm transition-all',
        isPlaying
          ? 'animate-pulse border-rpg-hp bg-rpg-hp/15 text-rpg-hp shadow-pixel-dark hover:bg-rpg-hp/25'
          : 'border-rpg-border bg-rpg-panel/95 text-rpg-ink-dim hover:border-rpg-hp hover:text-rpg-hp',
      ].join(' ')}
    >
      <VolumeX size={16} />
      <span>Parar Sons</span>
    </button>
  );
}
