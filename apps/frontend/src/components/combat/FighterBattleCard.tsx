import { useState } from 'react';
import { Minus, Plus, Skull, X, Wind } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import type { CombatFighter, EffectType, StatusEffect } from '../../types/combat';
import { fighterEmoji } from './AddFighterForm';
import {
  FIGHTER_STATUS_LABELS,
  FIGHTER_STATUS_STYLES,
  getFighterStatus,
  isFighterInBattle,
} from '../../utils/combat';
import { generateId } from '../../utils/text';

interface FighterBattleCardProps {
  fighter: CombatFighter;
  isActive: boolean;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<CombatFighter>) => void;
  onKill: () => void;
  onFlee: () => void;
}

export function FighterBattleCard({
  fighter,
  isActive,
  expanded,
  onToggle,
  onUpdate,
  onKill,
  onFlee,
}: FighterBattleCardProps) {
  const status = getFighterStatus(fighter);
  const inBattle = isFighterInBattle(fighter);
  const hpPercent = fighter.vidaMaxima > 0
    ? Math.min(100, (fighter.vidaAtual / fighter.vidaMaxima) * 100)
    : 0;

  return (
    <article
      className={[
        'border-2 bg-rpg-parchment transition-all',
        isActive && inBattle ? 'border-rpg-gold-dark shadow-pixel' : 'border-rpg-border',
        !inBattle ? 'opacity-55' : '',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        <div className="h-12 w-12 shrink-0 overflow-hidden border border-rpg-border">
          {fighter.imagem ? (
            <img src={fighter.imagem} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xl">
              {fighterEmoji(fighter)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-pixel text-[9px] text-rpg-gold-dark">
              #{fighter.ordemVez}
            </span>
            {isActive && inBattle && (
              <span className="border border-rpg-gold-dark bg-rpg-gold/20 px-1.5 py-0.5 font-sans text-[9px] font-bold text-rpg-gold-dark">
                TURNO
              </span>
            )}
            {!inBattle && (
              <span
                className={[
                  'border px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase',
                  FIGHTER_STATUS_STYLES[status],
                ].join(' ')}
              >
                {FIGHTER_STATUS_LABELS[status]}
              </span>
            )}
          </div>
          <p className="truncate font-sans text-sm font-bold">{fighter.nome}</p>
          <div className="mt-1 h-2 w-full border border-rpg-border bg-rpg-panel">
            <div
              className="h-full bg-rpg-hp transition-all"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <p className="mt-1 font-sans text-xs text-rpg-ink-faded">
            HP {fighter.vidaAtual}/{fighter.vidaMaxima} · CA {fighter.ca}
            {fighter.iniciativa !== null && ` · INI ${fighter.iniciativa}`}
          </p>
        </div>
      </button>

      {expanded && (
        <div className="border-t-2 border-rpg-border bg-rpg-panel/50 p-3">
          {inBattle && (
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onKill}
                className="flex items-center gap-1.5 border-2 border-rpg-hp/50 bg-rpg-hp/10 px-3 py-1.5 font-sans text-xs font-semibold text-rpg-hp transition-colors hover:border-rpg-hp hover:bg-rpg-hp/20"
              >
                <Skull size={14} />
                Matar
              </button>
              <button
                type="button"
                onClick={onFlee}
                className="flex items-center gap-1.5 border-2 border-rpg-gold-dark/50 bg-rpg-gold/10 px-3 py-1.5 font-sans text-xs font-semibold text-rpg-gold-dark transition-colors hover:border-rpg-gold-dark hover:bg-rpg-gold/20"
              >
                <Wind size={14} />
                Fugir
              </button>
            </div>
          )}

          <StatEditor
            label="Vida"
            value={fighter.vidaAtual}
            max={fighter.vidaMaxima}
            disabled={!inBattle}
            onChange={v => onUpdate({
              vidaAtual: Math.max(0, Math.min(fighter.vidaMaxima, v)),
              status: v <= 0 ? 'dead' : 'active',
            })}
            onMaxChange={max => onUpdate({
              vidaMaxima: max,
              vidaAtual: Math.min(fighter.vidaAtual, max),
            })}
          />
          <StatEditor
            label="CA"
            value={fighter.ca}
            disabled={!inBattle}
            onChange={v => onUpdate({ ca: Math.max(0, v) })}
          />
          <StatusEffectEditor
            title="Buffs"
            tipo="BUFF"
            effects={fighter.buffs}
            onChange={buffs => onUpdate({ buffs })}
          />
          <StatusEffectEditor
            title="Debuffs"
            tipo="DEBUFF"
            effects={fighter.debuffs}
            onChange={debuffs => onUpdate({ debuffs })}
          />
        </div>
      )}
    </article>
  );
}

function StatEditor({
  label,
  value,
  max,
  disabled,
  onChange,
  onMaxChange,
}: {
  label: string;
  value: number;
  max?: number;
  disabled?: boolean;
  onChange: (v: number) => void;
  onMaxChange?: (v: number) => void;
}) {
  return (
    <div className="mb-3">
      <p className="mb-1 font-sans text-xs font-bold text-rpg-ink-dim">{label}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(value - 1)}
          className="border-2 border-rpg-border bg-rpg-parchment p-1 hover:border-rpg-gold-dark disabled:opacity-40"
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          min={0}
          disabled={disabled}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-16 border-2 border-rpg-border bg-rpg-parchment px-2 py-1 text-center font-sans text-sm font-bold outline-none focus:border-rpg-gold disabled:opacity-50"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(value + 1)}
          className="border-2 border-rpg-border bg-rpg-parchment p-1 hover:border-rpg-gold-dark disabled:opacity-40"
        >
          <Plus size={14} />
        </button>
        {max !== undefined && onMaxChange && (
          <span className="ml-2 flex items-center gap-1 font-sans text-xs text-rpg-ink-faded">
            / máx
            <input
              type="number"
              min={1}
              value={max}
              onChange={e => onMaxChange(Number(e.target.value))}
              className="w-14 border border-rpg-border bg-rpg-parchment px-1 py-0.5 text-center text-xs outline-none focus:border-rpg-gold"
            />
          </span>
        )}
      </div>
    </div>
  );
}

function StatusEffectEditor({
  title,
  tipo,
  effects,
  onChange,
}: {
  title: string;
  tipo: EffectType;
  effects: StatusEffect[];
  onChange: (effects: StatusEffect[]) => void;
}) {
  const [nome, setNome] = useState('');
  const isBuff = tipo === 'BUFF';

  const add = () => {
    if (!nome.trim()) return;
    onChange([
      ...effects,
      { id: generateId('fx'), nome: nome.trim(), tipo },
    ]);
    setNome('');
  };

  const remove = (id: string) => onChange(effects.filter(e => e.id !== id));

  return (
    <div className="mb-3">
      <p className="mb-1 font-sans text-xs font-bold text-rpg-ink-dim">{title}</p>
      <div className="mb-2 flex flex-wrap gap-1">
        {effects.map(effect => (
          <span
            key={effect.id}
            className={[
              'inline-flex items-center gap-1 border px-2 py-0.5 font-sans text-[10px] font-semibold',
              isBuff
                ? 'border-rpg-forest/50 bg-rpg-forest/10 text-rpg-forest'
                : 'border-rpg-hp/50 bg-rpg-hp/10 text-rpg-hp',
            ].join(' ')}
          >
            {effect.nome}
            <button type="button" onClick={() => remove(effect.id)} className="opacity-70 hover:opacity-100">
              <X size={10} />
            </button>
          </span>
        ))}
        {effects.length === 0 && (
          <span className="font-sans text-[10px] text-rpg-ink-faded">Nenhum</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder={`Novo ${title.toLowerCase().slice(0, -1)}…`}
          className="min-w-0 flex-1 border-2 border-rpg-border bg-rpg-parchment px-2 py-1 font-sans text-xs outline-none focus:border-rpg-gold"
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <PixelButton type="button" variant="ghost" onClick={add}>
          <Plus size={12} />
        </PixelButton>
      </div>
    </div>
  );
}
