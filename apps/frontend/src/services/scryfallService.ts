const SCRYFALL_BASE = 'https://api.scryfall.com';
const SCRYFALL_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'RPGManager/1.0 (campaign tool)',
};

export interface ScryfallCardImage {
  id: string;
  name: string;
  typeLine?: string;
  setName?: string;
  imageUrl: string;
  source: 'scryfall';
}

interface ScryfallCard {
  id: string;
  name: string;
  type_line?: string;
  set_name?: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    art_crop?: string;
  };
  card_faces?: Array<{
    image_uris?: {
      small?: string;
      normal?: string;
      large?: string;
      art_crop?: string;
    };
  }>;
}

interface ScryfallSearchResponse {
  object: string;
  total_cards?: number;
  data?: ScryfallCard[];
  details?: string;
}

function cardImageUrl(card: ScryfallCard): string | null {
  const uris = card.image_uris ?? card.card_faces?.[0]?.image_uris;
  // Preferência: só a ilustração (sem bordas/texto da carta)
  return uris?.art_crop || uris?.normal || uris?.large || uris?.small || null;
}

export async function searchScryfallCardImages(
  query = '',
): Promise<ScryfallCardImage[]> {
  const trimmed = query.trim() || 'dragon';
  const params = new URLSearchParams({
    q: trimmed,
    unique: 'cards',
    order: 'name',
  });

  const response = await fetch(`${SCRYFALL_BASE}/cards/search?${params.toString()}`, {
    headers: SCRYFALL_HEADERS,
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error('Não foi possível consultar a Scryfall.');
  }

  const data = (await response.json()) as ScryfallSearchResponse;
  const cards = data.data ?? [];

  return cards
    .map((card): ScryfallCardImage | null => {
      const imageUrl = cardImageUrl(card);
      if (!imageUrl) return null;
      return {
        id: card.id,
        name: card.name,
        typeLine: card.type_line,
        setName: card.set_name,
        imageUrl,
        source: 'scryfall',
      };
    })
    .filter((item): item is ScryfallCardImage => item !== null)
    .slice(0, 60);
}

/** Primeira arte encontrada na Scryfall para um nome (fallback de retrato). */
export async function fetchScryfallImageForName(name: string): Promise<string | null> {
  const results = await searchScryfallCardImages(name);
  return results[0]?.imageUrl ?? null;
}
