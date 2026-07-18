import { useState } from 'react';
import { ArrowLeft, Pause, Play, SkipForward } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { TurnOrderStrip } from './CombatInitiative';
import { FighterBattleCard } from './FighterBattleCard';
import { useTurnTimer } from '../../hooks/useTurnTimer';
import type { Combat, CombatFighter } from '../../types/combat';
import { advanceTurn, getOrderedFighters, updateFighter } from '../../utils/combat';

interface CombatBattleProps {
  combat: Combat;
  onUpdate: (combat: Combat) => void;
  onBack: () => void;
  onEnd: () => void;
  onViewHistory: () => void;
}

export function CombatBattle({ combat, onUpdate, onBack, onEnd, onViewHistory }: CombatBattleProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const ordered = getOrderedFighters(combat.fighters);
  const currentFighter = ordered[combat.turno_atual_index];
  const { formatted, expired } = useTurnTimer(
    combat.tempo_turno_minutos,
    combat.turno_iniciado_em,
    paused,
  );

  const patchFighter = (fighterId: string, patch: Partial<CombatFighter>) => {
    onUpdate(updateFighter(combat, fighterId, patch));
  };

  const handleKill = (fighterId: string, nome: string) => {
    if (window.confirm(`Marcar "${nome}" como morto?`)) {
      patchFighter(fighterId, { status: 'dead', vidaAtual: 0 });
    }
  };

  const handleFlee = (fighterId: string, nome: string) => {
    if (window.confirm(`"${nome}" fugiu da batalha?`)) {
      patchFighter(fighterId, { status: 'fled' });
    }
  };

  const handleRevive = (fighterId: string, nome: string) => {
    if (window.confirm(`Reviver "${nome}"?`)) {
      patchFighter(fighterId, { status: 'active' });
    }
  };

  const handleNextTurn = () => {
    const next = advanceTurn(combat);
    onUpdate(next);
    setExpandedId(null);
    setPaused(false);
  };

  const handleResetTimer = () => {
    onUpdate({ ...combat, turno_iniciado_em: Date.now() });
    setPaused(false);
  };

  if (combat.fase === 'finished') {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="pixel-subtitle mb-2">⚔️ COMBATE ENCERRADO</p>
        <h1 className="pixel-title mb-6">{combat.nome}</h1>
        <p className="mb-6 font-sans text-rpg-ink-dim">
          Todos os combatentes foram derrotados, fugiram ou o combate foi finalizado.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <PixelButton variant="gold" onClick={onViewHistory}>
            Ver histórico
          </PixelButton>
          <PixelButton variant="ghost" onClick={onBack}>
            Voltar à arena
          </PixelButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Sair da batalha
      </button>

      <header className="mb-5 border-2 border-rpg-border bg-rpg-panel p-4 shadow-pixel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pixel-subtitle mb-1">⚔️ EM BATALHA</p>
            <h1 className="font-pixel text-pixel-sm text-rpg-ink-dark">{combat.nome}</h1>
            <p className="mt-1 font-sans text-sm text-rpg-ink-faded">
              Rodada {combat.rodada_atual}
              {currentFighter && (
                <>
                  {' '}
                  · Turno de{' '}
                  <span className="font-semibold text-rpg-gold-dark">{currentFighter.nome}</span>
                </>
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wide text-rpg-ink-faded">
              Tempo do turno
            </p>
            <p
              className={[
                'font-pixel text-2xl tabular-nums',
                expired ? 'text-rpg-hp' : 'text-rpg-gold-dark',
              ].join(' ')}
            >
              {formatted}
            </p>
            <div className="mt-2 flex justify-center gap-2">
              <button
                type="button"
                title={paused ? 'Retomar' : 'Pausar'}
                onClick={() => setPaused(p => !p)}
                className="border-2 border-rpg-border bg-rpg-parchment p-1.5 hover:border-rpg-gold-dark"
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
              <button
                type="button"
                title="Reiniciar cronômetro"
                onClick={handleResetTimer}
                className="border-2 border-rpg-border bg-rpg-parchment px-2 py-1 font-sans text-[10px] hover:border-rpg-gold-dark"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 font-sans text-[10px] font-bold uppercase text-rpg-ink-faded">
            Ordem de turnos
          </p>
          <TurnOrderStrip fighters={combat.fighters} currentIndex={combat.turno_atual_index} />
        </div>
      </header>

      <div className="mb-4 flex flex-wrap gap-3">
        <PixelButton variant="gold" onClick={handleNextTurn}>
          <span className="flex items-center gap-2">
            <SkipForward size={14} />
            Próximo turno
          </span>
        </PixelButton>
        <PixelButton variant="ghost" onClick={onEnd}>
          Encerrar combate
        </PixelButton>
      </div>

      <PixelCard title="Combatentes" icon="👥">
        <p className="mb-3 font-sans text-xs text-rpg-ink-faded">
          Clique em um combatente para editar vida, CA, atributos, habilidades, buffs e debuffs.
          Personagens só morrem pelo botão Matar; use Reviver para trazê-los de volta.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {ordered.map((fighter, index) => (
            <li key={fighter.id}>
              <FighterBattleCard
                fighter={fighter}
                isActive={index === combat.turno_atual_index}
                expanded={expandedId === fighter.id}
                onToggle={() =>
                  setExpandedId(expandedId === fighter.id ? null : fighter.id)
                }
                onUpdate={patch => patchFighter(fighter.id, patch)}
                onKill={() => handleKill(fighter.id, fighter.nome)}
                onFlee={() => handleFlee(fighter.id, fighter.nome)}
                onRevive={() => handleRevive(fighter.id, fighter.nome)}
              />
            </li>
          ))}
        </ul>
      </PixelCard>
    </div>
  );
}
