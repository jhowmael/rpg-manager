import { Howl } from 'howler';
import { getAudioById, type AudioCategory } from '../data/soundLibrary';

export interface ActiveAudioTrack {
  audioId: string;
  label: string;
  emoji: string;
  category: AudioCategory;
  volume: number;
}

const howlCache = new Map<string, Howl>();
const userVolumes = new Map<string, number>();
const activeTracks = new Map<string, ActiveAudioTrack>();
let currentMusicId: string | null = null;

const AUDIO_CHANGED_EVENT = 'rpg-audio-active-changed';
const AUDIO_STOPPED_EVENT = 'rpg-audio-stopped';

function getBaseVolume(category: AudioCategory): number {
  return category === 'music' ? 0.4 : 0.85;
}

function notifyActiveChange(): void {
  window.dispatchEvent(new CustomEvent(AUDIO_CHANGED_EVENT));
}

function registerTrack(audioId: string): void {
  const item = getAudioById(audioId);
  if (!item) return;

  activeTracks.set(audioId, {
    audioId,
    label: item.label,
    emoji: item.emoji,
    category: item.category,
    volume: userVolumes.get(audioId) ?? 1,
  });
  notifyActiveChange();
}

function unregisterTrack(audioId: string): void {
  if (activeTracks.delete(audioId)) {
    notifyActiveChange();
  }
}

function applyVolume(howl: Howl, audioId: string, category: AudioCategory): void {
  const userVolume = userVolumes.get(audioId) ?? 1;
  howl.volume(getBaseVolume(category) * userVolume);
}

function createHowl(audioId: string): Howl | null {
  const item = getAudioById(audioId);
  if (!item) return null;

  const isMusic = item.category === 'music';

  return new Howl({
    src: [item.url],
    volume: getBaseVolume(item.category) * (userVolumes.get(audioId) ?? 1),
    loop: isMusic,
    html5: isMusic,
    preload: true,
    onplay: () => registerTrack(audioId),
    onend: () => {
      if (isMusic && currentMusicId === audioId) {
        currentMusicId = null;
      }
      unregisterTrack(audioId);
      window.dispatchEvent(new CustomEvent(AUDIO_STOPPED_EVENT));
    },
    onstop: () => {
      unregisterTrack(audioId);
      window.dispatchEvent(new CustomEvent(AUDIO_STOPPED_EVENT));
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

export function getActiveTracks(): ActiveAudioTrack[] {
  return Array.from(activeTracks.values());
}

export function setTrackVolume(audioId: string, volume: number): void {
  const clamped = Math.max(0, Math.min(1, volume));
  userVolumes.set(audioId, clamped);

  const track = activeTracks.get(audioId);
  if (track) {
    track.volume = clamped;
  }

  const item = getAudioById(audioId);
  const howl = howlCache.get(audioId);
  if (howl && item) {
    applyVolume(howl, audioId, item.category);
  }

  notifyActiveChange();
}

export function stopTrack(audioId: string): void {
  const howl = howlCache.get(audioId);
  howl?.stop();

  if (currentMusicId === audioId) {
    currentMusicId = null;
  }

  unregisterTrack(audioId);
  window.dispatchEvent(new CustomEvent(AUDIO_STOPPED_EVENT));
}

export function stopMusic(): void {
  if (currentMusicId) {
    stopTrack(currentMusicId);
  }
}

export function stopAllAudio(): void {
  howlCache.forEach(howl => howl.stop());
  currentMusicId = null;
  activeTracks.clear();
  notifyActiveChange();
  window.dispatchEvent(new CustomEvent(AUDIO_STOPPED_EVENT));
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
    applyVolume(howl, audioId, item.category);

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

  applyVolume(howl, audioId, item.category);

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

export const AUDIO_EVENTS = {
  changed: AUDIO_CHANGED_EVENT,
  stopped: AUDIO_STOPPED_EVENT,
} as const;
