import { Howl } from 'howler';
import { getAudioById } from '../data/soundLibrary';

const howlCache = new Map<string, Howl>();
let currentMusicId: string | null = null;

function createHowl(audioId: string): Howl | null {
  const item = getAudioById(audioId);
  if (!item) return null;

  const isMusic = item.category === 'music';

  return new Howl({
    src: [item.url],
    volume: isMusic ? 0.4 : 0.85,
    loop: isMusic,
    html5: isMusic,
    preload: true,
    onend: () => {
      if (isMusic && currentMusicId === audioId) {
        currentMusicId = null;
        window.dispatchEvent(new CustomEvent('rpg-audio-stopped'));
      }
    },
    onstop: () => {
      window.dispatchEvent(new CustomEvent('rpg-audio-stopped'));
    },
  });
}

function getOrCreateHowl(audioId: string): Howl | null {
  const cached = howlCache.get(audioId);
  if (cached) return cached;

  const howl = createHowl(audioId);
  if (!howl) return null;

  howlCache.set(audioId, howl);
  return howl;
}

export function stopMusic(): void {
  if (currentMusicId) {
    const howl = howlCache.get(currentMusicId);
    howl?.stop();
    currentMusicId = null;
  }
}

/** Para todos os sons e músicas em reprodução */
export function stopAllAudio(): void {
  howlCache.forEach(howl => howl.stop());
  currentMusicId = null;
  window.dispatchEvent(new CustomEvent('rpg-audio-stopped'));
}

export function isAnyAudioPlaying(): boolean {
  for (const howl of howlCache.values()) {
    if (howl.playing()) return true;
  }
  return false;
}

export function playAudio(audioId: string): void {
  const item = getAudioById(audioId);
  if (!item) return;

  if (item.category === 'music') {
    const howl = getOrCreateHowl(audioId);
    if (!howl) return;

    if (currentMusicId === audioId && howl.playing()) {
      howl.stop();
      currentMusicId = null;
      return;
    }

    stopMusic();
    currentMusicId = audioId;

    if (howl.state() === 'loaded') {
      howl.play();
    } else {
      howl.once('load', () => howl.play());
      howl.load();
    }
    return;
  }

  const howl = getOrCreateHowl(audioId);
  if (!howl) return;

  if (howl.state() === 'loaded') {
    howl.play();
  } else {
    howl.once('load', () => howl.play());
    howl.load();
  }
}

export function isMusicPlaying(audioId: string): boolean {
  if (currentMusicId !== audioId) return false;
  const howl = howlCache.get(audioId);
  return howl?.playing() ?? false;
}
