import { useCallback, useEffect, useState } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';
import {
  AUDIO_EVENTS,
  getActiveTracks,
  isAnyAudioPlaying,
  setTrackVolume,
  stopAllAudio,
  stopTrack,
  type ActiveAudioTrack,
} from '../../hooks/useAudioPlayer';

export function AudioControllerPanel() {
  const [tracks, setTracks] = useState<ActiveAudioTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const sync = useCallback(() => {
    setTracks(getActiveTracks());
    setIsPlaying(isAnyAudioPlaying());
  }, []);

  useEffect(() => {
    sync();

    window.addEventListener(AUDIO_EVENTS.changed, sync);
    window.addEventListener(AUDIO_EVENTS.stopped, sync);

    const interval = setInterval(sync, 500);

    return () => {
      clearInterval(interval);
      window.removeEventListener(AUDIO_EVENTS.changed, sync);
      window.removeEventListener(AUDIO_EVENTS.stopped, sync);
    };
  }, [sync]);

  const handleStopAll = () => {
    stopAllAudio();
    sync();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-xs flex-col items-end gap-2">
      {tracks.length > 0 && (
        <div className="w-full border-2 border-rpg-border bg-rpg-panel/95 shadow-pixel-dark backdrop-blur-sm">
          <div className="border-b-2 border-rpg-border px-3 py-2">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wide text-rpg-ink-dim">
              Sons ativos
            </p>
          </div>

          <ul className="max-h-56 overflow-y-auto panel-scroll">
            {tracks.map(track => (
              <li
                key={track.audioId}
                className="border-b border-rpg-border/60 px-3 py-2 last:border-b-0"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-base leading-none">{track.emoji}</span>
                  <span className="min-w-0 flex-1 truncate font-sans text-xs font-semibold text-rpg-ink-dark">
                    {track.label}
                  </span>
                  <span
                    className={[
                      'shrink-0 border px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase',
                      track.category === 'music'
                        ? 'border-rpg-mana/50 bg-rpg-mana/10 text-rpg-mana'
                        : 'border-rpg-gold-dark/50 bg-rpg-gold/10 text-rpg-gold-dark',
                    ].join(' ')}
                  >
                    {track.category === 'music' ? 'Música' : 'SFX'}
                  </span>
                  <button
                    type="button"
                    onClick={() => stopTrack(track.audioId)}
                    title="Remover este som"
                    className="shrink-0 border border-rpg-border p-1 text-rpg-hp transition-colors hover:border-rpg-hp hover:bg-rpg-hp/10"
                  >
                    <X size={12} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 size={12} className="shrink-0 text-rpg-ink-faded" />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(track.volume * 100)}
                    onChange={e => setTrackVolume(track.audioId, Number(e.target.value) / 100)}
                    className="h-1.5 flex-1 cursor-pointer accent-rpg-gold"
                    aria-label={`Volume de ${track.label}`}
                  />
                  <span className="w-8 text-right font-sans text-[10px] tabular-nums text-rpg-ink-faded">
                    {Math.round(track.volume * 100)}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={handleStopAll}
        title="Parar todos os sons em reprodução"
        className={[
          'flex items-center gap-2 border-2 px-3 py-2 font-sans text-xs font-semibold shadow-pixel backdrop-blur-sm transition-all',
          isPlaying
            ? 'animate-pulse border-rpg-hp bg-rpg-hp/15 text-rpg-hp shadow-pixel-dark hover:bg-rpg-hp/25'
            : 'border-rpg-border bg-rpg-panel/95 text-rpg-ink-dim hover:border-rpg-hp hover:text-rpg-hp',
        ].join(' ')}
      >
        <VolumeX size={16} />
        <span>Parar Sons</span>
      </button>
    </div>
  );
}
