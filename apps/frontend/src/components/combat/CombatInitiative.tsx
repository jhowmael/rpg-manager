import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, Dices, Swords } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { fighterEmoji } from './AddFighterForm';
import type { Combat, CombatFighter } from '../../types/combat';
import {
  applyInitiativeTiebreak,
  assignOrdemVez,
  buildInitiativeOrderEntries,
  getOrderedFighters,
  getTiedFighterIds,
  getFighterStatus,
  isFighterInBattle,
  resolveInitiativeOrder,
  type InitiativeOrderEntry,
} from '../../utils/combat';

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
  const [orderEntries, setOrderEntries] = useState<InitiativeOrderEntry[] | null>(null);
  const [tieRound, setTieRound] = useState(0);
  const [tieRolls, setTieRolls] = useState<Record<string, number | null>>({});

  const allFilled = combat.fighters.every(f => f.iniciativa !== null && f.iniciativa !== undefined);

  // Se a iniciativa base mudar, reinicia o desempate.
  const initiativeSignature = combat.fighters
    .map(f => `${f.id}:${f.iniciativa ?? ''}`)
    .join('|');

  useEffect(() => {
    setOrderEntries(null);
    setTieRound(0);
    setTieRolls({});
  }, [initiativeSignature]);

  const activeEntries = useMemo(() => {
    if (!allFilled) return [];
    return orderEntries ?? buildInitiativeOrderEntries(combat.fighters);
  }, [allFilled, orderEntries, combat.fighters]);

  const tiedIds = useMemo(() => getTiedFighterIds(activeEntries), [activeEntries]);
  const hasTies = tiedIds.length > 0;
  const tiedSet = useMemo(() => new Set(tiedIds), [tiedIds]);

  const preview = useMemo(() => {
    if (!allFilled) return [];
    return assignOrdemVez(resolveInitiativeOrder(combat.fighters, activeEntries));
  }, [allFilled, combat.fighters, activeEntries]);

  const allTieRollsFilled =
    tiedIds.length > 0 && tiedIds.every(id => tieRolls[id] !== null && tieRolls[id] !== undefined);

  const handleConfirmBase = () => {
    if (!allFilled) return;
    const entries = buildInitiativeOrderEntries(combat.fighters);
    setOrderEntries(entries);
    const tied = getTiedFighterIds(entries);
    if (tied.length === 0) {
      setTieRound(0);
      setTieRolls({});
      return;
    }
    setTieRound(1);
    setTieRolls(Object.fromEntries(tied.map(id => [id, null])));
  };

  const handleApplyTiebreak = () => {
    if (!allTieRollsFilled || activeEntries.length === 0) return;

    const rolls: Record<string, number> = {};
    for (const id of tiedIds) {
      rolls[id] = tieRolls[id] ?? 0;
    }

    const next = applyInitiativeTiebreak(activeEntries, rolls);
    setOrderEntries(next);

    const stillTied = getTiedFighterIds(next);
    if (stillTied.length === 0) {
      setTieRound(0);
      setTieRolls({});
      return;
    }

    setTieRound(r => r + 1);
    setTieRolls(Object.fromEntries(stillTied.map(id => [id, null])));
  };

  const handleStart = () => {
    if (!allFilled || hasTies) return;
    const ordered = assignOrdemVez(resolveInitiativeOrder(combat.fighters, activeEntries));
    onStartBattle(ordered);
  };

  const confirmedOrder = orderEntries !== null;
  const waitingTiebreak = confirmedOrder && hasTies;

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
          Informe a iniciativa de cada um. Empates geram rodadas só entre os empatados,
          sem alterar a posição de quem já está atrás.
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
                  disabled={confirmedOrder}
                  value={fighter.iniciativa ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    onUpdateFighter(fighter.id, {
                      iniciativa: val === '' ? null : Number(val),
                    });
                  }}
                  className="w-16 border-2 border-rpg-border bg-rpg-panel px-2 py-1 text-center font-sans text-sm font-bold outline-none focus:border-rpg-gold disabled:opacity-50"
                />
              </li>
            ))}
          </ul>

          {!confirmedOrder && (
            <div className="mt-4">
              <PixelButton variant="forest" onClick={handleConfirmBase} disabled={!allFilled}>
                <span className="flex items-center gap-2">
                  <Dices size={14} />
                  Confirmar iniciativas
                </span>
              </PixelButton>
            </div>
          )}

          {confirmedOrder && (
            <button
              type="button"
              onClick={() => {
                setOrderEntries(null);
                setTieRound(0);
                setTieRolls({});
              }}
              className="mt-3 font-sans text-xs text-rpg-ink-faded underline hover:text-rpg-ink-dark"
            >
              Alterar iniciativas base
            </button>
          )}
        </PixelCard>

        <PixelCard title="Ordem da batalha" icon="📋">
          {allFilled && confirmedOrder ? (
            <ol className="flex flex-col gap-2">
              {preview.map((fighter, index) => {
                const tied = tiedSet.has(fighter.id);
                return (
                  <li
                    key={fighter.id}
                    className={[
                      'flex items-center gap-3 border-2 px-3 py-2',
                      tied
                        ? 'border-rpg-mana bg-rpg-mana/10'
                        : 'border-rpg-border bg-rpg-panel',
                    ].join(' ')}
                  >
                    <span className="font-pixel text-[10px] text-rpg-gold-dark">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 truncate font-sans text-sm">{fighter.nome}</span>
                    <span className="font-sans text-xs font-bold text-rpg-mana">
                      INI {fighter.iniciativa}
                    </span>
                    {tied && (
                      <span className="border border-rpg-mana px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase text-rpg-mana">
                        Empate
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : allFilled ? (
            <p className="py-8 text-center font-sans text-sm text-rpg-ink-faded">
              Confirme as iniciativas para ver a ordem e resolver empates.
            </p>
          ) : (
            <p className="py-8 text-center font-sans text-sm text-rpg-ink-faded">
              Preencha a iniciativa de todos para ver a ordem.
            </p>
          )}
        </PixelCard>
      </div>

      {waitingTiebreak && (
        <div className="mt-5 border-2 border-rpg-mana bg-rpg-mana/5 p-4 shadow-pixel">
          <p className="pixel-label mb-1 text-rpg-mana">
            Desempate — rodada {tieRound}
          </p>
          <p className="mb-4 font-sans text-xs text-rpg-ink-dim">
            Só os empatados rolam de novo. A posição do grupo se mantém: quem empatou em 1º/2º
            continua disputando só essas vagas.
          </p>
          <ul className="mb-4 flex flex-col gap-3">
            {tiedIds.map(id => {
              const fighter = combat.fighters.find(f => f.id === id);
              if (!fighter) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 border-2 border-rpg-mana/40 bg-rpg-parchment p-3"
                >
                  <span className="min-w-0 flex-1 truncate font-sans text-sm font-semibold">
                    {fighter.nome}
                  </span>
                  <span className="font-sans text-[10px] text-rpg-ink-faded">
                    INI base {fighter.iniciativa}
                  </span>
                  <input
                    type="number"
                    placeholder="Nova"
                    value={tieRolls[id] ?? ''}
                    onChange={e => {
                      const val = e.target.value;
                      setTieRolls(prev => ({
                        ...prev,
                        [id]: val === '' ? null : Number(val),
                      }));
                    }}
                    className="w-20 border-2 border-rpg-mana bg-rpg-panel px-2 py-1 text-center font-sans text-sm font-bold outline-none focus:border-rpg-gold"
                  />
                </li>
              );
            })}
          </ul>
          <PixelButton variant="forest" onClick={handleApplyTiebreak} disabled={!allTieRollsFilled}>
            <span className="flex items-center gap-2">
              <Dices size={14} />
              Aplicar desempate
            </span>
          </PixelButton>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <PixelButton variant="ghost" onClick={onBack}>
          Voltar
        </PixelButton>
        <PixelButton
          variant="gold"
          onClick={handleStart}
          disabled={!allFilled || !confirmedOrder || hasTies}
        >
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
