import { ArrowLeft, ChevronRight, Swords } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { fighterEmoji } from './AddFighterForm';
import type { Combat, CombatFighter } from '../../types/combat';
import { getOrderedFighters, sortFightersByInitiative, getFighterStatus, isFighterInBattle } from '../../utils/combat';

interface CombatInitiativeProps {
  combat: Combat;
  onUpdateFighter: (fighterId: string, patch: Partial<CombatFighter>) => void;
  onStartBattle: (sortedFighters: CombatFighter[]) => void;
  onBack: () => void;
}

export function CombatInitiative({
  combat,
  onUpdateFighter,
  onStartBattle,
  onBack,
}: CombatInitiativeProps) {
  const preview = sortFightersByInitiative(
    combat.fighters.map(f => ({
      ...f,
      iniciativa: f.iniciativa ?? 0,
    })),
  );

  const allFilled = combat.fighters.every(f => f.iniciativa !== null && f.iniciativa !== undefined);

  const handleStart = () => {
    const sorted = sortFightersByInitiative(
      combat.fighters.map(f => ({ ...f, iniciativa: f.iniciativa ?? 0 })),
    );
    onStartBattle(sorted);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar ao cadastro
      </button>

      <header className="mb-6 text-center">
        <p className="pixel-subtitle mb-2">⚔️ FASE 2 — INICIATIVA</p>
        <h1 className="pixel-title">{combat.nome}</h1>
        <p className="mt-2 font-sans text-sm text-rpg-ink-faded">
          Informe a iniciativa de cada um. O sistema ordena do maior para o menor.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <PixelCard title="Iniciativa" icon="🎲">
          <ul className="flex flex-col gap-3">
            {combat.fighters.map(fighter => (
              <li
                key={fighter.id}
                className="flex items-center gap-3 border-2 border-rpg-border bg-rpg-parchment p-3"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden border border-rpg-border">
                  {fighter.imagem ? (
                    <img src={fighter.imagem} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">{fighterEmoji(fighter)}</div>
                  )}
                </div>
                <span className="min-w-0 flex-1 truncate font-sans text-sm font-semibold">
                  {fighter.nome}
                </span>
                <input
                  type="number"
                  placeholder="—"
                  value={fighter.iniciativa ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    onUpdateFighter(fighter.id, {
                      iniciativa: val === '' ? null : Number(val),
                    });
                  }}
                  className="w-16 border-2 border-rpg-border bg-rpg-panel px-2 py-1 text-center font-sans text-sm font-bold outline-none focus:border-rpg-gold"
                />
              </li>
            ))}
          </ul>
        </PixelCard>

        <PixelCard title="Ordem da batalha" icon="📋">
          {allFilled ? (
            <ol className="flex flex-col gap-2">
              {preview.map((fighter, index) => (
                <li
                  key={fighter.id}
                  className="flex items-center gap-3 border-2 border-rpg-border bg-rpg-panel px-3 py-2"
                >
                  <span className="font-pixel text-[10px] text-rpg-gold-dark">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 truncate font-sans text-sm">{fighter.nome}</span>
                  <span className="font-sans text-xs font-bold text-rpg-mana">
                    INI {fighter.iniciativa}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="py-8 text-center font-sans text-sm text-rpg-ink-faded">
              Preencha a iniciativa de todos para ver a ordem.
            </p>
          )}
        </PixelCard>
      </div>

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <PixelButton variant="ghost" onClick={onBack}>
          Voltar
        </PixelButton>
        <PixelButton variant="gold" onClick={handleStart} disabled={!allFilled}>
          <span className="flex items-center gap-2">
            <Swords size={14} />
            Iniciar batalha
            <ChevronRight size={14} />
          </span>
        </PixelButton>
      </div>
    </div>
  );
}

export function TurnOrderStrip({
  fighters,
  currentIndex,
}: {
  fighters: CombatFighter[];
  currentIndex: number;
}) {
  const ordered = getOrderedFighters(fighters);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {ordered.map((fighter, index) => {
        const isActive = index === currentIndex;
        const inBattle = isFighterInBattle(fighter);
        const status = getFighterStatus(fighter);
        return (
          <div
            key={fighter.id}
            className={[
              'flex shrink-0 items-center gap-2 border-2 px-3 py-2 transition-all',
              isActive && inBattle
                ? 'border-rpg-gold-dark bg-rpg-gold/20 shadow-pixel'
                : 'border-rpg-border bg-rpg-parchment',
              !inBattle ? 'opacity-40' : '',
            ].join(' ')}
          >
            <span className="font-pixel text-[9px] text-rpg-ink-faded">
              {fighter.ordemVez}
            </span>
            <span className="max-w-[6rem] truncate font-sans text-xs font-semibold">
              {fighter.nome}
            </span>
            {status === 'dead' && <span className="text-xs">💀</span>}
            {status === 'fled' && <span className="text-xs">🏃</span>}
            {isActive && inBattle && <span className="text-xs">▶</span>}
          </div>
        );
      })}
    </div>
  );
}
