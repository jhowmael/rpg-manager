import { ArrowLeft } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { fighterEmoji, sourceLabel } from './AddFighterForm';
import type { Combat } from '../../types/combat';
import {
  FIGHTER_STATUS_LABELS,
  FIGHTER_STATUS_STYLES,
  formatCombatDate,
  getFighterStatus,
  getOrderedFighters,
} from '../../utils/combat';

interface CombatHistoryProps {
  combat: Combat;
  onBack: () => void;
}

export function CombatHistory({ combat, onBack }: CombatHistoryProps) {
  const fighters = getOrderedFighters(combat.fighters);
  const mortos = fighters.filter(f => getFighterStatus(f) === 'dead').length;
  const fugiram = fighters.filter(f => getFighterStatus(f) === 'fled').length;
  const sobreviveram = fighters.filter(f => getFighterStatus(f) === 'active').length;

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar à arena
      </button>

      <header className="mb-6 text-center">
        <p className="pixel-subtitle mb-2">📜 HISTÓRICO</p>
        <h1 className="pixel-title">{combat.nome}</h1>
        <p className="mt-2 font-sans text-sm text-rpg-ink-faded">
          {combat.encerrado_em
            ? `Encerrado em ${formatCombatDate(combat.encerrado_em)}`
            : `Criado em ${formatCombatDate(combat.criado_em)}`}
          {combat.rodada_atual > 1 && ` · ${combat.rodada_atual} rodadas`}
        </p>
      </header>

      <div className="mb-4 flex flex-wrap justify-center gap-2">
        <SummaryChip label="Lutaram" value={fighters.length} />
        <SummaryChip label="Sobreviveram" value={sobreviveram} variant="forest" />
        <SummaryChip label="Mortos" value={mortos} variant="hp" />
        <SummaryChip label="Fugiram" value={fugiram} variant="gold" />
      </div>

      <PixelCard title="Quem lutou" icon="⚔️">
        {fighters.length === 0 ? (
          <p className="py-6 text-center font-sans text-sm text-rpg-ink-faded">
            Nenhum combatente registrado neste encontro.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {fighters.map(fighter => {
              const status = getFighterStatus(fighter);
              return (
                <li
                  key={fighter.id}
                  className="flex items-center gap-3 border-2 border-rpg-border bg-rpg-parchment p-3"
                >
                  <div className="h-11 w-11 shrink-0 overflow-hidden border border-rpg-border bg-rpg-panel">
                    {fighter.imagem ? (
                      <img src={fighter.imagem} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-lg">
                        {fighterEmoji(fighter)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-sm font-bold text-rpg-ink-dark">
                      {fighter.nome}
                    </p>
                    <p className="font-sans text-xs text-rpg-ink-faded">
                      {sourceLabel(fighter.source)}
                      {fighter.iniciativa !== null && ` · INI ${fighter.iniciativa}`}
                      {status === 'active' && ` · HP ${fighter.vidaAtual}/${fighter.vidaMaxima}`}
                    </p>
                  </div>
                  <span
                    className={[
                      'shrink-0 border px-2 py-0.5 font-sans text-[10px] font-bold uppercase',
                      FIGHTER_STATUS_STYLES[status],
                    ].join(' ')}
                  >
                    {FIGHTER_STATUS_LABELS[status]}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </PixelCard>

      <div className="mt-6">
        <PixelButton variant="ghost" onClick={onBack}>
          Voltar
        </PixelButton>
      </div>
    </div>
  );
}

function SummaryChip({
  label,
  value,
  variant = 'default',
}: {
  label: string;
  value: number;
  variant?: 'default' | 'forest' | 'hp' | 'gold';
}) {
  const styles = {
    default: 'border-rpg-border bg-rpg-panel text-rpg-ink-dim',
    forest: 'border-rpg-forest/50 bg-rpg-forest/10 text-rpg-forest',
    hp: 'border-rpg-hp/50 bg-rpg-hp/10 text-rpg-hp',
    gold: 'border-rpg-gold-dark/50 bg-rpg-gold/10 text-rpg-gold-dark',
  };

  return (
    <div className={['border-2 px-3 py-1.5 text-center', styles[variant]].join(' ')}>
      <p className="font-pixel text-sm leading-none">{value}</p>
      <p className="mt-0.5 font-sans text-[9px] uppercase">{label}</p>
    </div>
  );
}
