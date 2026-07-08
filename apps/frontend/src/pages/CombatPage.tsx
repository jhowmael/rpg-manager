import { useState } from 'react';
import { CombatBattle } from '../components/combat/CombatBattle';
import { CombatHistory } from '../components/combat/CombatHistory';
import { CombatInitiative } from '../components/combat/CombatInitiative';
import { CombatList } from '../components/combat/CombatList';
import { CombatSetup } from '../components/combat/CombatSetup';
import type { Character } from '../types/character';
import type { Hero } from '../types/hero';
import type { Combat, CombatFighter, NewFighterData } from '../types/combat';
import { updateFighter } from '../utils/combat';
import { generateId } from '../utils/text';

type View = 'list' | 'setup' | 'initiative' | 'battle' | 'history';

interface CombatPageProps {
  campaignId: string;
  campaignName: string;
  characters: Character[];
  heroes: Hero[];
  combats: Combat[];
  onCombatsChange: (combats: Combat[]) => void;
}

function createEmptyCombat(campaignId: string): Combat {
  return {
    id: generateId('combat'),
    campanha_id: campaignId,
    nome: '',
    tempo_turno_minutos: 3,
    fase: 'setup',
    rodada_atual: 1,
    turno_atual_index: 0,
    turno_iniciado_em: null,
    fighters: [],
    criado_em: new Date().toISOString(),
  };
}

function createFighter(data: NewFighterData): CombatFighter {
  return {
    id: generateId('fighter'),
    nome: data.nome,
    source: data.source,
    sourceId: data.sourceId,
    imagem: data.imagem,
    vidaMaxima: data.vidaMaxima,
    vidaAtual: data.vidaAtual,
    ca: data.ca,
    iniciativa: null,
    ordemVez: 0,
    buffs: [],
    debuffs: [],
    status: 'active',
  };
}

export function CombatPage({
  campaignId,
  campaignName,
  characters,
  heroes,
  combats,
  onCombatsChange,
}: CombatPageProps) {
  const [view, setView] = useState<View>('list');
  const [activeCombatId, setActiveCombatId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const campaignCombats = combats.filter(c => c.campanha_id === campaignId);
  const campaignCharacters = characters.filter(c => c.campanha_id === campaignId);
  const campaignHeroes = heroes.filter(h => h.campanha_id === campaignId);
  const activeCombat = activeCombatId
    ? combats.find(c => c.id === activeCombatId)
    : null;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const updateCombat = (id: string, patch: Partial<Combat> | Combat) => {
    onCombatsChange(
      combats.map(c => (c.id === id ? { ...c, ...patch } : c)),
    );
  };

  const goToList = () => {
    setActiveCombatId(null);
    setView('list');
  };

  const openCombat = (combat: Combat) => {
    setActiveCombatId(combat.id);
    if (combat.fase === 'finished') setView('history');
    else if (combat.fase === 'setup') setView('setup');
    else if (combat.fase === 'initiative') setView('initiative');
    else setView('battle');
  };

  const handleCreate = () => {
    const combat = createEmptyCombat(campaignId);
    onCombatsChange([combat, ...combats]);
    setActiveCombatId(combat.id);
    setView('setup');
    showToast('⚔️ Novo combate criado!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este combate?')) {
      onCombatsChange(combats.filter(c => c.id !== id));
      if (activeCombatId === id) goToList();
      showToast('Combate removido.');
    }
  };

  if (!activeCombat) {
    return (
      <>
        <p className="mb-4 text-center font-sans text-sm text-rpg-ink-faded">
          Campanha: <span className="font-semibold text-rpg-ink-dark">{campaignName}</span>
        </p>
        <CombatList
          combats={campaignCombats}
          onCreate={handleCreate}
          onOpen={openCombat}
          onDelete={handleDelete}
        />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  const banner = (
    <p className="mb-4 text-center font-sans text-sm text-rpg-ink-faded">
      Campanha: <span className="font-semibold text-rpg-ink-dark">{campaignName}</span>
    </p>
  );

  if (view === 'setup') {
    return (
      <>
        {banner}
        <CombatSetup
          combat={activeCombat}
          heroes={campaignHeroes}
          characters={campaignCharacters}
          onUpdate={patch => updateCombat(activeCombat.id, patch)}
          onAddFighter={data => {
            updateCombat(activeCombat.id, {
              fighters: [...activeCombat.fighters, createFighter(data)],
            });
          }}
          onRemoveFighter={fighterId => {
            updateCombat(activeCombat.id, {
              fighters: activeCombat.fighters.filter(f => f.id !== fighterId),
            });
          }}
          onNext={() => {
            updateCombat(activeCombat.id, { fase: 'initiative' });
            setView('initiative');
          }}
          onBack={goToList}
        />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  if (view === 'initiative') {
    return (
      <>
        {banner}
        <CombatInitiative
          combat={activeCombat}
          onUpdateFighter={(fighterId, patch) => {
            updateCombat(activeCombat.id, updateFighter(activeCombat, fighterId, patch));
          }}
          onStartBattle={sortedFighters => {
            updateCombat(activeCombat.id, {
              fase: 'battle',
              fighters: sortedFighters,
              rodada_atual: 1,
              turno_atual_index: 0,
              turno_iniciado_em: Date.now(),
            });
            setView('battle');
            showToast('⚔️ Batalha iniciada!');
          }}
          onBack={() => {
            updateCombat(activeCombat.id, { fase: 'setup' });
            setView('setup');
          }}
        />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  if (view === 'history' && activeCombat) {
    return (
      <>
        {banner}
        <CombatHistory combat={activeCombat} onBack={goToList} />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  return (
    <>
      {banner}
      <CombatBattle
        combat={activeCombat}
        onUpdate={combat => updateCombat(activeCombat.id, combat)}
        onBack={goToList}
        onEnd={() => {
          if (window.confirm('Encerrar este combate?')) {
            updateCombat(activeCombat.id, {
              fase: 'finished',
              turno_iniciado_em: null,
              encerrado_em: new Date().toISOString(),
            });
            showToast('Combate encerrado.');
            setView('history');
          }
        }}
        onViewHistory={() => setView('history')}
      />
      {toast && <Toast message={toast} />}
    </>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-6 z-50 border-2 border-rpg-border-dark bg-rpg-panel px-5 py-3 font-sans text-base text-rpg-ink-dark shadow-pixel-dark">
      {message}
    </div>
  );
}
