export type AudioCategory = 'sfx' | 'music';

/**
 * Áudio local em /public/audio/
 * Fonte: DRAGON-STUDIO (Pixabay) — https://pixabay.com/pt/users/dragon-studio-38165424/
 *
 * SFX: arquivos em public/audio/sfx/ (nome do arquivo = referência na url)
 * Música: arquivos em public/audio/music/
 */

export const DRAGON_STUDIO_PROFILE =
  'https://pixabay.com/pt/users/dragon-studio-38165424/';

export interface AudioItem {
  id: string;
  label: string;
  emoji: string;
  category: AudioCategory;
  url: string;
  /** Nome do arquivo em public/audio/ */
  filename: string;
  sourceUrl?: string;
}

function sfxPath(filename: string): string {
  return `/audio/sfx/${encodeURIComponent(filename)}`;
}

function musicPath(filename: string): string {
  return `/audio/music/${encodeURIComponent(filename)}`;
}

/** Mapeamento id → arquivo em public/audio/sfx/ */
export const SFX_LIBRARY: AudioItem[] = [
  {
    id: 'cavalgar',
    label: 'Cavalgar',
    emoji: '🐴',
    category: 'sfx',
    filename: 'cavalgar.mp3',
    url: sfxPath('cavalgar.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'chuva-trovao',
    label: 'Chuva com Trovão',
    emoji: '⛈️',
    category: 'sfx',
    filename: 'chuva-com-trovao.mp3',
    url: sfxPath('chuva-com-trovao.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'chuva',
    label: 'Chuva',
    emoji: '🌧️',
    category: 'sfx',
    filename: 'chuva.mp3',
    url: sfxPath('chuva.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'defesa-espada',
    label: 'Defesa de Espada',
    emoji: '🛡️',
    category: 'sfx',
    filename: 'defesa-espada.mp3',
    url: sfxPath('defesa-espada.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'goteira-caverna',
    label: 'Goteira de Caverna',
    emoji: '💧',
    category: 'sfx',
    filename: 'goteira-caverna.mp3',
    url: sfxPath('goteira-caverna.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'lareira',
    label: 'Lareira',
    emoji: '🔥',
    category: 'sfx',
    filename: 'lareira.mp3',
    url: sfxPath('lareira.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'luta-espadas',
    label: 'Luta de Espadas',
    emoji: '⚔️',
    category: 'sfx',
    filename: 'luta-espadas.mp3',
    url: sfxPath('luta-espadas.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'moedas',
    label: 'Moedas',
    emoji: '🪙',
    category: 'sfx',
    filename: 'moedas.mp3',
    url: sfxPath('moedas.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'natureza',
    label: 'Natureza',
    emoji: '🌲',
    category: 'sfx',
    filename: 'natureza.mp3',
    url: sfxPath('natureza.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'passos',
    label: 'Passos',
    emoji: '👣',
    category: 'sfx',
    filename: 'passos.mp3',
    url: sfxPath('passos.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'rosnado-dragao',
    label: 'Rosnado de Dragão',
    emoji: '🐉',
    category: 'sfx',
    filename: 'rosnado-dragao.mp3',
    url: sfxPath('rosnado-dragao.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'rosnar-fera',
    label: 'Rosnar de Fera',
    emoji: '🦁',
    category: 'sfx',
    filename: 'rosnar-fera.mp3',
    url: sfxPath('rosnar-fera.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'sacar-espada',
    label: 'Sacar Espada',
    emoji: '🗡️',
    category: 'sfx',
    filename: 'sacar-espada.mp3',
    url: sfxPath('sacar-espada.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'uivo-lobo',
    label: 'Uivo de Lobo',
    emoji: '🐺',
    category: 'sfx',
    filename: 'uivo-lobo.mp3',
    url: sfxPath('uivo-lobo.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'voar-dragao',
    label: 'Voar de Dragão',
    emoji: '🦇',
    category: 'sfx',
    filename: 'voar-dragao.mp3',
    url: sfxPath('voar-dragao.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'abrindo-porta',
    label: 'Abrindo Porta',
    emoji: '🚪',
    category: 'sfx',
    filename: 'abrindo-porta.mp3',
    url: sfxPath('abrindo-porta.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'fechando-porta',
    label: 'Fechando Porta',
    emoji: '🚪',
    category: 'sfx',
    filename: 'fechando-porta.mp3',
    url: sfxPath('fechando-porta.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  }
];

export const MUSIC_LIBRARY: AudioItem[] = [
  {
    id: 'taverna',
    label: 'Taverna',
    emoji: '🍺',
    category: 'music',
    filename: 'taverna.mp3',
    url: musicPath('taverna.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'conversas',
    label: 'Conversas',
    emoji: '💬',
    category: 'music',
    filename: 'conversas.mp3',
    url: musicPath('conversas.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'flauta',
    label: 'Flauta',
    emoji: '🪈',
    category: 'music',
    filename: 'flauta.mp3',
    url: musicPath('flauta.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'inspiradora',
    label: 'Inspiradora',
    emoji: '✨',
    category: 'music',
    filename: 'inpiradora.mp3',
    url: musicPath('inpiradora.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'luta-boss',
    label: 'Luta de Boss',
    emoji: '⚔️',
    category: 'music',
    filename: 'luta-boss.mp3',
    url: musicPath('luta-boss.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'misterio',
    label: 'Mistério',
    emoji: '🔮',
    category: 'music',
    filename: 'misterio.mp3',
    url: musicPath('misterio.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
  {
    id: 'suspense-piano',
    label: 'Suspense (Piano)',
    emoji: '🎹',
    category: 'music',
    filename: 'suspense-piano.mp3',
    url: musicPath('suspense-piano.mp3'),
    sourceUrl: DRAGON_STUDIO_PROFILE,
  },
];

export const ALL_AUDIO: AudioItem[] = [...SFX_LIBRARY, ...MUSIC_LIBRARY];

export function getAudioById(id: string): AudioItem | undefined {
  return ALL_AUDIO.find(item => item.id === id);
}

export const AUDIO_DRAG_TYPE = 'application/rpg-audio';

export interface AudioDragPayload {
  audioId: string;
  category: AudioCategory;
  label: string;
}
