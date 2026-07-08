import type { Combat, CombatFighter } from '../types/combat';
import { getEntityImageUrl } from '../utils/entityImage';
import { apiRequest } from './api';

type ApiCombat = Omit<Combat, 'fighters'> & {
  fighters: (Omit<CombatFighter, 'imagem'> & { imagem?: string })[];
};

function mapCombatFromApi(data: ApiCombat): Combat {
  return {
    ...data,
    fighters: data.fighters.map(fighter => ({
      ...fighter,
      imagem: getEntityImageUrl(fighter.imagem),
    })),
  };
}

function mapCombatToApi(combat: Combat): Record<string, unknown> {
  return {
    campanha_id: combat.campanha_id,
    nome: combat.nome,
    tempo_turno_minutos: combat.tempo_turno_minutos,
    fase: combat.fase,
    rodada_atual: combat.rodada_atual,
    turno_atual_index: combat.turno_atual_index,
    turno_iniciado_em: combat.turno_iniciado_em,
    encerrado_em: combat.encerrado_em ?? null,
    fighters: combat.fighters.map(fighter => ({
      id: fighter.id,
      nome: fighter.nome,
      source: fighter.source,
      sourceId: fighter.sourceId,
      vidaMaxima: fighter.vidaMaxima,
      vidaAtual: fighter.vidaAtual,
      ca: fighter.ca,
      iniciativa: fighter.iniciativa,
      ordemVez: fighter.ordemVez,
      status: fighter.status,
      buffs: fighter.buffs,
      debuffs: fighter.debuffs,
    })),
  };
}

export async function fetchCombats(campaignId: string): Promise<Combat[]> {
  const data = await apiRequest<ApiCombat[]>(
    `/combat?campanha_id=${encodeURIComponent(campaignId)}`,
  );
  return data.map(mapCombatFromApi);
}

export async function createCombat(
  data: Pick<Combat, 'campanha_id' | 'nome' | 'tempo_turno_minutos' | 'fase' | 'fighters'> &
    Partial<Pick<Combat, 'rodada_atual' | 'turno_atual_index' | 'turno_iniciado_em'>>,
): Promise<Combat> {
  const created = await apiRequest<ApiCombat>('/combat', {
    method: 'POST',
    body: JSON.stringify(mapCombatToApi(data as Combat)),
  });
  return mapCombatFromApi(created);
}

export async function updateCombat(id: string, combat: Combat): Promise<Combat> {
  const updated = await apiRequest<ApiCombat>(`/combat/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(mapCombatToApi(combat)),
  });
  return mapCombatFromApi(updated);
}

export async function deleteCombat(id: string): Promise<void> {
  await apiRequest(`/combat/${id}`, { method: 'DELETE' });
}
