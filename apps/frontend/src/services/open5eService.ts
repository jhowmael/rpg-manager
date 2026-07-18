import type { CharacterAbility, CharacterAttributes } from '../types/character';
import { CHARACTER_CLASSES, CHARACTER_RACES } from '../data/characterOptions';

const OPEN5E_BASE = 'https://api.open5e.com/v1';

export interface Open5eMonsterImage {
  slug: string;
  name: string;
  type?: string;
  challengeRating?: string;
  imageUrl: string;
}

export interface Open5eMonsterSummary {
  slug: string;
  name: string;
  type?: string;
  size?: string;
  challengeRating?: string;
  armorClass?: number;
  hitPoints?: number;
  hasImage: boolean;
  imageUrl?: string;
}

export interface Open5eSheetImport {
  nome: string;
  titulo?: string;
  raca?: string;
  classe?: string;
  historia?: string;
  caracteristicas?: string;
  vida_maxima: number;
  ca: number;
  atributos: CharacterAttributes;
  habilidades: CharacterAbility[];
  imageUrl?: string;
}

interface Open5eActionLike {
  name?: string;
  desc?: string;
}

interface Open5eMonsterResult {
  slug: string;
  name: string;
  type?: string;
  size?: string;
  subtype?: string;
  alignment?: string;
  armor_class?: number;
  armor_desc?: string;
  hit_points?: number;
  hit_dice?: string;
  challenge_rating?: string | number;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  senses?: string;
  languages?: string;
  speed?: Record<string, number | string> | string;
  desc?: string;
  img_main?: string | null;
  actions?: Open5eActionLike[] | null;
  bonus_actions?: Open5eActionLike[] | null;
  reactions?: Open5eActionLike[] | null;
  special_abilities?: Open5eActionLike[] | null;
  legendary_actions?: Open5eActionLike[] | null;
  legendary_desc?: string | null;
}

interface Open5eListResponse {
  count: number;
  next: string | null;
  results: Open5eMonsterResult[];
}

function normalizeImageUrl(url: string): string {
  return url.replace(/^http:\/\//i, 'https://');
}

/** Open5e às vezes devolve a raiz da API em vez de um arquivo de imagem. */
export function isUsableOpen5eImageUrl(url?: string | null): url is string {
  if (!url) return false;
  const normalized = normalizeImageUrl(url);
  return normalized.includes('/static/img/') && /\.(png|jpe?g|gif|webp)(\?|$)/i.test(normalized);
}

function challengeLabel(value?: string | number | null): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return String(value);
}

function clampAttr(value: number | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 10;
  return Math.max(1, Math.min(30, Math.round(value)));
}

function mapTypeToRace(type?: string, subtype?: string, name?: string): string {
  const haystack = `${type ?? ''} ${subtype ?? ''} ${name ?? ''}`.toLowerCase();

  const directMatches: Array<[string, string]> = [
    ['goblin', 'Goblin'],
    ['orc', 'Orc'],
    ['troll', 'Troll'],
    ['dragon', 'Draconato'],
    ['undead', 'Morto-vivo'],
    ['construct', 'Construto'],
    ['aberration', 'Aberração'],
    ['beast', 'Besta'],
    ['giant', 'Gigante'],
    ['monstrosity', 'Monstruosidade'],
    ['elf', 'Elfo'],
    ['dwarf', 'Anão'],
    ['halfling', 'Halfling'],
    ['gnome', 'Gnomo'],
    ['tiefling', 'Tiefling'],
  ];

  for (const [needle, race] of directMatches) {
    if (haystack.includes(needle)) return race;
  }

  // humanoid genérico não vira "Humano" — cai em Outro
  const byType: Record<string, string> = {
    aberration: 'Aberração',
    beast: 'Besta',
    construct: 'Construto',
    dragon: 'Draconato',
    giant: 'Gigante',
    monstrosity: 'Monstruosidade',
    undead: 'Morto-vivo',
  };

  const mapped = type ? byType[type.toLowerCase()] : undefined;
  if (mapped && (CHARACTER_RACES as readonly string[]).includes(mapped)) {
    return mapped;
  }

  return 'Outro';
}

function mapClassFromApi(): string {
  return 'Outro';
}

export function ensureOptionInList(
  value: string | undefined,
  options: readonly string[],
  fallback = 'Outro',
): string {
  if (!value?.trim()) return fallback;
  if (options.includes(value)) return value;
  return fallback;
}

function formatSpeed(speed?: Record<string, number | string> | string): string | undefined {
  if (!speed) return undefined;
  if (typeof speed === 'string') return speed;
  return Object.entries(speed)
    .map(([key, value]) => `${key} ${value}`)
    .join(', ');
}

function toAbility(prefix: string, action: Open5eActionLike): CharacterAbility | null {
  const nome = action.name?.trim();
  if (!nome) return null;
  return {
    id: crypto.randomUUID(),
    nome: prefix ? `${prefix}${nome}` : nome,
    descricao: action.desc?.trim() ?? '',
  };
}

function collectAbilities(monster: Open5eMonsterResult): CharacterAbility[] {
  const abilities: CharacterAbility[] = [];

  const pushAll = (items: Open5eActionLike[] | null | undefined, prefix = '') => {
    for (const item of items ?? []) {
      const ability = toAbility(prefix, item);
      if (ability) abilities.push(ability);
    }
  };

  pushAll(monster.special_abilities);
  pushAll(monster.actions);
  pushAll(monster.bonus_actions, 'Ação bônus: ');
  pushAll(monster.reactions, 'Reação: ');

  if (monster.legendary_desc?.trim()) {
    abilities.push({
      id: crypto.randomUUID(),
      nome: 'Ações lendárias',
      descricao: monster.legendary_desc.trim(),
    });
  }
  pushAll(monster.legendary_actions, 'Lendária: ');

  return abilities;
}

function mapSummary(monster: Open5eMonsterResult): Open5eMonsterSummary {
  const hasImage = isUsableOpen5eImageUrl(monster.img_main);
  return {
    slug: monster.slug,
    name: monster.name,
    type: monster.type,
    size: monster.size,
    challengeRating: challengeLabel(monster.challenge_rating),
    armorClass: monster.armor_class,
    hitPoints: monster.hit_points,
    hasImage,
    imageUrl: hasImage ? normalizeImageUrl(monster.img_main!) : undefined,
  };
}

export async function searchOpen5eMonsterImages(
  query = '',
): Promise<Open5eMonsterImage[]> {
  const summaries = await searchOpen5eMonsters(query);
  const images = summaries
    .filter(item => item.hasImage && item.imageUrl)
    .map(item => ({
      slug: item.slug,
      name: item.name,
      type: item.type,
      challengeRating: item.challengeRating,
      imageUrl: item.imageUrl!,
    }));

  const seen = new Set<string>();
  return images.filter(item => {
    if (seen.has(item.imageUrl)) return false;
    seen.add(item.imageUrl);
    return true;
  });
}

export async function searchOpen5eMonsters(query = ''): Promise<Open5eMonsterSummary[]> {
  const params = new URLSearchParams({
    limit: '60',
    document__slug: 'wotc-srd',
  });

  const trimmed = query.trim();
  if (trimmed) {
    params.set('search', trimmed);
  }

  const response = await fetch(`${OPEN5E_BASE}/monsters/?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Não foi possível consultar a Open5e.');
  }

  const data = (await response.json()) as Open5eListResponse;
  return data.results.map(mapSummary);
}

function wikiTitleCandidates(name: string): string[] {
  const cleaned = name.trim();
  const withoutSize = cleaned.replace(
    /^(Tiny|Small|Medium|Large|Huge|Gargantuan)\s+/i,
    '',
  );
  const withoutAge = withoutSize.replace(
    /^(Young|Adult|Ancient|Wyrmling|Giant|Dire)\s+/i,
    '',
  );
  const words = withoutAge.split(/\s+/).filter(Boolean);
  const lastTwo = words.length >= 2 ? words.slice(-2).join(' ') : withoutAge;
  const last = words[words.length - 1] ?? withoutAge;

  return [...new Set([cleaned, withoutSize, withoutAge, lastTwo, last].filter(Boolean))];
}

async function fetchWikipediaThumbnail(title: string): Promise<string | null> {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
  );
  if (!response.ok) return null;

  const data = (await response.json()) as {
    thumbnail?: { source?: string };
    originalimage?: { source?: string };
  };

  return data.originalimage?.source || data.thumbnail?.source || null;
}

async function fetchCommonsImage(query: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '10',
    prop: 'imageinfo',
    iiprop: 'url|mime',
    iiurlwidth: '800',
    format: 'json',
    origin: '*',
  });

  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`);
  if (!response.ok) return null;

  const data = (await response.json()) as {
    query?: {
      pages?: Record<
        string,
        {
          title?: string;
          imageinfo?: Array<{
            url?: string;
            thumburl?: string;
            mime?: string;
          }>;
        }
      >;
    };
  };

  const pages = Object.values(data.query?.pages ?? {});
  const blocked = /logo|icon|flag|map|svg|cosplay|slayer|poster|cover|album/i;

  for (const page of pages) {
    const title = page.title ?? '';
    if (blocked.test(title)) continue;
    const info = page.imageinfo?.[0];
    if (!info) continue;
    if (info.mime && !info.mime.startsWith('image/')) continue;
    if (info.mime === 'image/svg+xml') continue;
    const url = info.thumburl || info.url;
    if (url && /\.(png|jpe?g|gif|webp)(\?|$)/i.test(url)) {
      return url;
    }
  }

  return null;
}

/**
 * Resolve a portrait URL: Open5e → Scryfall → Wikipedia/Commons.
 */
export async function resolveMonsterImageUrl(
  name: string,
  open5eImageUrl?: string | null,
): Promise<string | null> {
  if (isUsableOpen5eImageUrl(open5eImageUrl)) {
    return normalizeImageUrl(open5eImageUrl);
  }

  try {
    const { fetchScryfallImageForName } = await import('./scryfallService');
    const scryfall = await fetchScryfallImageForName(name);
    if (scryfall) return scryfall;
  } catch {
    // segue para Wikipedia/Commons
  }

  for (const title of wikiTitleCandidates(name)) {
    try {
      const wiki = await fetchWikipediaThumbnail(title);
      if (wiki) return wiki;
    } catch {
      // tenta próximo candidato
    }
  }

  const commonsQueries = [
    `${name} fantasy creature`,
    `${name} mythology`,
    `${name} illustration`,
  ];

  for (const query of commonsQueries) {
    try {
      const commons = await fetchCommonsImage(query);
      if (commons) return commons;
    } catch {
      // tenta próxima query
    }
  }

  return null;
}

export async function fetchOpen5eMonster(slug: string): Promise<Open5eMonsterResult> {
  const response = await fetch(`${OPEN5E_BASE}/monsters/${encodeURIComponent(slug)}/`);
  if (!response.ok) {
    throw new Error('Não foi possível carregar o monstro da Open5e.');
  }
  return response.json() as Promise<Open5eMonsterResult>;
}

export function mapOpen5eMonsterToSheet(monster: Open5eMonsterResult): Open5eSheetImport {
  const cr = challengeLabel(monster.challenge_rating);
  const speed = formatSpeed(monster.speed);
  const traitLines = [
    monster.size && monster.type
      ? `${monster.size} ${monster.type}${monster.subtype ? ` (${monster.subtype})` : ''}`
      : monster.type,
    monster.alignment ? `Alinhamento: ${monster.alignment}` : null,
    cr ? `CR ${cr}` : null,
    monster.armor_desc ? `Armadura: ${monster.armor_desc}` : null,
    monster.hit_dice ? `Dados de vida: ${monster.hit_dice}` : null,
    speed ? `Deslocamento: ${speed}` : null,
    monster.senses ? `Sentidos: ${monster.senses}` : null,
    monster.languages ? `Idiomas: ${monster.languages}` : null,
  ].filter(Boolean);

  const vida = Math.max(1, monster.hit_points ?? 10);
  const ca = Math.max(0, monster.armor_class ?? 10);
  const hasImage = isUsableOpen5eImageUrl(monster.img_main);

  return {
    nome: monster.name,
    titulo: cr ? `CR ${cr}` : monster.type,
    raca: ensureOptionInList(
      mapTypeToRace(monster.type, monster.subtype, monster.name),
      CHARACTER_RACES,
      'Outro',
    ),
    classe: ensureOptionInList(mapClassFromApi(), CHARACTER_CLASSES, 'Outro'),
    historia: monster.desc?.trim() || undefined,
    caracteristicas: traitLines.join('\n') || undefined,
    vida_maxima: vida,
    ca,
    atributos: {
      forca: clampAttr(monster.strength),
      destreza: clampAttr(monster.dexterity),
      constituicao: clampAttr(monster.constitution),
      inteligencia: clampAttr(monster.intelligence),
      sabedoria: clampAttr(monster.wisdom),
      carisma: clampAttr(monster.charisma),
    },
    habilidades: collectAbilities(monster),
    imageUrl: hasImage ? normalizeImageUrl(monster.img_main!) : undefined,
  };
}

export async function importOpen5eMonsterSheet(slug: string): Promise<Open5eSheetImport> {
  const monster = await fetchOpen5eMonster(slug);
  return mapOpen5eMonsterToSheet(monster);
}

export async function fetchRemoteImageAsFile(
  imageUrl: string,
  filenameBase: string,
): Promise<File> {
  const response = await fetch(normalizeImageUrl(imageUrl));
  if (!response.ok) {
    throw new Error('Não foi possível baixar a imagem.');
  }

  const blob = await response.blob();
  const sourceType = blob.type.startsWith('image/') ? blob.type : 'image/png';
  const bitmap = await createImageBitmap(blob);
  const maxSide = 1024;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Não foi possível processar a imagem.');
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const outputType = sourceType.includes('png') ? 'image/png' : 'image/jpeg';
  const quality = outputType === 'image/jpeg' ? 0.86 : undefined;

  const compressed = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      result => {
        if (result) resolve(result);
        else reject(new Error('Não foi possível processar a imagem.'));
      },
      outputType,
      quality,
    );
  });

  const extension = outputType === 'image/png' ? 'png' : 'jpg';
  const safeName = filenameBase
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'monster-portrait';

  return new File([compressed], `${safeName}.${extension}`, { type: outputType });
}

export interface Open5eCondition {
  slug: string;
  name: string;
  namePt: string;
  desc: string;
}

const CONDITION_NAME_PT: Record<string, string> = {
  Blinded: 'Cego',
  Charmed: 'Enfeitiçado',
  Deafened: 'Surdo',
  Exhaustion: 'Exaustão',
  Frightened: 'Amedrontado',
  Grappled: 'Agarrado',
  Incapacitated: 'Incapacitado',
  Invisible: 'Invisível',
  Paralyzed: 'Paralisado',
  Petrified: 'Petrificado',
  Poisoned: 'Envenenado',
  Prone: 'Caído',
  Restrained: 'Contido',
  Stunned: 'Atordoado',
  Unconscious: 'Inconsciente',
};

let conditionsCache: Open5eCondition[] | null = null;
let conditionsPromise: Promise<Open5eCondition[]> | null = null;

function cleanConditionDesc(raw: string): string {
  return raw
    .replace(/\*\*/g, '')
    .replace(/^\*\s*/gm, '• ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

export async function fetchOpen5eConditions(): Promise<Open5eCondition[]> {
  if (conditionsCache) return conditionsCache;
  if (conditionsPromise) return conditionsPromise;

  conditionsPromise = (async () => {
    const response = await fetch(`${OPEN5E_BASE}/conditions/?limit=50`);
    if (!response.ok) {
      throw new Error('Não foi possível carregar as condições da Open5e.');
    }

    const data = (await response.json()) as {
      results?: Array<{ slug: string; name: string; desc?: string }>;
    };

    const mapped = (data.results ?? []).map(item => ({
      slug: item.slug,
      name: item.name,
      namePt: CONDITION_NAME_PT[item.name] ?? item.name,
      desc: cleanConditionDesc(item.desc ?? ''),
    }));

    conditionsCache = mapped;
    return mapped;
  })();

  try {
    return await conditionsPromise;
  } catch (error) {
    conditionsPromise = null;
    throw error;
  }
}

