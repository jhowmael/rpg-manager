import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Minus,
  Plus,
  Save,
  Skull,
  X,
  Wind,
} from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import type {
  CharacterAbility,
  CharacterAttributes,
  CombatFighter,
  EffectType,
  StatusEffect,
} from '../../types/combat';
import { DEFAULT_ATTRIBUTES } from '../../types/combat';
import { fighterEmoji } from './AddFighterForm';
import {
  FIGHTER_STATUS_LABELS,
  FIGHTER_STATUS_STYLES,
  getFighterStatus,
  isFighterInBattle,
} from '../../utils/combat';
import {
  fetchOpen5eConditions,
  type Open5eCondition,
} from '../../services/open5eService';

interface FighterBattleCardProps {
  fighter: CombatFighter;
  isActive: boolean;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<CombatFighter>) => void;
  onKill: () => void;
  onFlee: () => void;
  onRevive: () => void;
  onSaveToSheet?: () => Promise<void> | void;
}

const ATTR_LABELS: { key: keyof CharacterAttributes; label: string }[] = [
  { key: 'forca', label: 'FOR' },
  { key: 'destreza', label: 'DES' },
  { key: 'constituicao', label: 'CON' },
  { key: 'inteligencia', label: 'INT' },
  { key: 'sabedoria', label: 'SAB' },
  { key: 'carisma', label: 'CAR' },
];

function canSaveToSheet(fighter: CombatFighter): boolean {
  return Boolean(
    fighter.sourceId && (fighter.source === 'NPC' || fighter.source === 'MOB' || fighter.source === 'CUSTOM'),
  );
}

export function FighterBattleCard({
  fighter,
  isActive,
  expanded,
  onToggle,
  onUpdate,
  onKill,
  onFlee,
  onRevive,
  onSaveToSheet,
}: FighterBattleCardProps) {
  const status = getFighterStatus(fighter);
  const inBattle = isFighterInBattle(fighter);
  const atributos = { ...DEFAULT_ATTRIBUTES, ...fighter.atributos };
  const habilidades = fighter.habilidades ?? [];
  const showSave = canSaveToSheet(fighter) && Boolean(onSaveToSheet);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const hpPercent = fighter.vidaMaxima > 0
    ? Math.min(100, (fighter.vidaAtual / fighter.vidaMaxima) * 100)
    : 0;

  const handleSave = async () => {
    if (!onSaveToSheet || saving) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      await onSaveToSheet();
      setSaveMessage('Ficha atualizada!');
    } catch {
      setSaveMessage('Falha ao salvar na ficha.');
    } finally {
      setSaving(false);
    }
  };

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
        <span className="shrink-0 text-rpg-ink-faded" aria-hidden>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {expanded && (
        <div className="border-t-2 border-rpg-border bg-rpg-panel/50 p-3">
          <div className="mb-3 flex flex-wrap gap-2">
            {inBattle && (
              <>
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
              </>
            )}
            {!inBattle && (
              <button
                type="button"
                onClick={onRevive}
                className="flex items-center gap-1.5 border-2 border-rpg-forest/50 bg-rpg-forest/10 px-3 py-1.5 font-sans text-xs font-semibold text-rpg-forest transition-colors hover:border-rpg-forest hover:bg-rpg-forest/20"
              >
                <Heart size={14} />
                Reviver
              </button>
            )}
            {showSave && (
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="flex items-center gap-1.5 border-2 border-rpg-mana/50 bg-rpg-mana/10 px-3 py-1.5 font-sans text-xs font-semibold text-rpg-mana transition-colors hover:border-rpg-mana hover:bg-rpg-mana/20 disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? 'Salvando…' : 'Salvar na ficha'}
              </button>
            )}
          </div>

          {saveMessage && (
            <p className="mb-3 font-sans text-xs text-rpg-ink-dim">{saveMessage}</p>
          )}

          <StatEditor
            label="Vida"
            value={fighter.vidaAtual}
            max={fighter.vidaMaxima}
            disabled={!inBattle}
            onChange={v => onUpdate({
              vidaAtual: Math.max(0, Math.min(fighter.vidaMaxima, v)),
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

          <AttributesEditor
            atributos={atributos}
            disabled={!inBattle}
            onChange={next => onUpdate({ atributos: next })}
          />

          <AbilitiesEditor
            habilidades={habilidades}
            disabled={!inBattle}
            onChange={next => onUpdate({ habilidades: next })}
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

function AttributesEditor({
  atributos,
  disabled,
  onChange,
}: {
  atributos: CharacterAttributes;
  disabled?: boolean;
  onChange: (attrs: CharacterAttributes) => void;
}) {
  return (
    <div className="mb-3">
      <p className="mb-1 font-sans text-xs font-bold text-rpg-ink-dim">Atributos</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {ATTR_LABELS.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <span className="font-sans text-[9px] font-bold text-rpg-ink-faded">{label}</span>
            <input
              type="number"
              min={1}
              max={30}
              disabled={disabled}
              value={atributos[key]}
              onChange={e =>
                onChange({
                  ...atributos,
                  [key]: Math.max(1, Number(e.target.value) || 1),
                })
              }
              className="w-full border-2 border-rpg-border bg-rpg-parchment px-1 py-1 text-center font-sans text-xs font-bold outline-none focus:border-rpg-gold disabled:opacity-50"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AbilitiesEditor({
  habilidades,
  disabled,
  onChange,
}: {
  habilidades: CharacterAbility[];
  disabled?: boolean;
  onChange: (abilities: CharacterAbility[]) => void;
}) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const add = () => {
    if (!nome.trim()) return;
    onChange([
      ...habilidades,
      { id: crypto.randomUUID(), nome: nome.trim(), descricao: descricao.trim() },
    ]);
    setNome('');
    setDescricao('');
  };

  const remove = (id: string) => onChange(habilidades.filter(a => a.id !== id));

  return (
    <div className="mb-3">
      <p className="mb-1 font-sans text-xs font-bold text-rpg-ink-dim">Habilidades</p>
      <div className="mb-2 flex flex-col gap-2">
        {habilidades.map(ability => (
          <div
            key={ability.id}
            className="border border-rpg-mana/40 bg-rpg-mana/5 px-2 py-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-sans text-xs font-bold text-rpg-mana">{ability.nome}</p>
              {!disabled && (
                <button type="button" onClick={() => remove(ability.id)} className="text-rpg-hp opacity-70 hover:opacity-100">
                  <X size={12} />
                </button>
              )}
            </div>
            {ability.descricao && (
              <p className="mt-0.5 font-sans text-[10px] text-rpg-ink-dim">{ability.descricao}</p>
            )}
          </div>
        ))}
        {habilidades.length === 0 && (
          <span className="font-sans text-[10px] text-rpg-ink-faded">Nenhuma</span>
        )}
      </div>
      {!disabled && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Nome da habilidade…"
            className="border-2 border-rpg-border bg-rpg-parchment px-2 py-1 font-sans text-xs outline-none focus:border-rpg-gold"
          />
          <input
            type="text"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Descrição…"
            className="border-2 border-rpg-border bg-rpg-parchment px-2 py-1 font-sans text-xs outline-none focus:border-rpg-gold"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          />
          <PixelButton type="button" variant="ghost" onClick={add}>
            <Plus size={12} />
            Adicionar habilidade
          </PixelButton>
        </div>
      )}
    </div>
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
  const [conditions, setConditions] = useState<Open5eCondition[]>([]);
  const [conditionsError, setConditionsError] = useState<string | null>(null);
  const [loadingConditions, setLoadingConditions] = useState(true);
  const isBuff = tipo === 'BUFF';

  useEffect(() => {
    let cancelled = false;
    setLoadingConditions(true);
    void fetchOpen5eConditions()
      .then(list => {
        if (!cancelled) setConditions(list);
      })
      .catch(() => {
        if (!cancelled) setConditionsError('Não foi possível carregar condições da Open5e.');
      })
      .finally(() => {
        if (!cancelled) setLoadingConditions(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addManual = () => {
    if (!nome.trim()) return;
    onChange([
      ...effects,
      {
        id: crypto.randomUUID(),
        nome: nome.trim(),
        tipo,
        origem: 'manual',
      },
    ]);
    setNome('');
  };

  const addCondition = (condition: Open5eCondition) => {
    const already = effects.some(
      effect => effect.nome.toLowerCase() === condition.namePt.toLowerCase()
        || effect.nome.toLowerCase() === condition.name.toLowerCase(),
    );
    if (already) return;

    onChange([
      ...effects,
      {
        id: crypto.randomUUID(),
        nome: condition.namePt,
        tipo,
        descricao: condition.desc || undefined,
        origem: 'open5e',
      },
    ]);
  };

  const remove = (id: string) => onChange(effects.filter(e => e.id !== id));

  return (
    <div className="mb-3">
      <p className="mb-1 font-sans text-xs font-bold text-rpg-ink-dim">{title}</p>
      <div className="mb-2 flex flex-wrap gap-1">
        {effects.map(effect => (
          <span
            key={effect.id}
            title={effect.descricao || undefined}
            className={[
              'inline-flex max-w-full items-center gap-1 border px-2 py-0.5 font-sans text-[10px] font-semibold',
              isBuff
                ? 'border-rpg-forest/50 bg-rpg-forest/10 text-rpg-forest'
                : 'border-rpg-hp/50 bg-rpg-hp/10 text-rpg-hp',
            ].join(' ')}
          >
            <span className="truncate">{effect.nome}</span>
            <button type="button" onClick={() => remove(effect.id)} className="opacity-70 hover:opacity-100">
              <X size={10} />
            </button>
          </span>
        ))}
        {effects.length === 0 && (
          <span className="font-sans text-[10px] text-rpg-ink-faded">Nenhum</span>
        )}
      </div>

      <div className="mb-2">
        <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-rpg-ink-faded">
          Condições SRD
        </p>
        {loadingConditions && (
          <p className="font-sans text-[10px] text-rpg-ink-faded">Carregando…</p>
        )}
        {conditionsError && (
          <p className="font-sans text-[10px] text-rpg-hp">{conditionsError}</p>
        )}
        {!loadingConditions && conditions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {conditions.map(condition => {
              const active = effects.some(
                effect =>
                  effect.nome.toLowerCase() === condition.namePt.toLowerCase()
                  || effect.nome.toLowerCase() === condition.name.toLowerCase(),
              );
              return (
                <button
                  key={condition.slug}
                  type="button"
                  title={condition.desc || condition.name}
                  disabled={active}
                  onClick={() => addCondition(condition)}
                  className={[
                    'border px-2 py-0.5 font-sans text-[10px] font-semibold transition-colors',
                    active
                      ? 'cursor-default border-rpg-border/50 bg-rpg-panel text-rpg-ink-faded opacity-50'
                      : isBuff
                        ? 'border-rpg-forest/40 bg-rpg-parchment text-rpg-forest hover:border-rpg-forest hover:bg-rpg-forest/10'
                        : 'border-rpg-hp/40 bg-rpg-parchment text-rpg-hp hover:border-rpg-hp hover:bg-rpg-hp/10',
                  ].join(' ')}
                >
                  {condition.namePt}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ou digite um efeito personalizado…"
          className="min-w-0 flex-1 border-2 border-rpg-border bg-rpg-parchment px-2 py-1 font-sans text-xs outline-none focus:border-rpg-gold"
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addManual())}
        />
        <PixelButton type="button" variant="ghost" onClick={addManual}>
          <Plus size={12} />
        </PixelButton>
      </div>
    </div>
  );
}
