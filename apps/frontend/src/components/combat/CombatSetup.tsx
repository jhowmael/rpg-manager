import { ArrowLeft, ChevronRight } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { PixelInput } from '../ui/PixelInput';
import { AddFighterForm, FighterSetupRow } from './AddFighterForm';
import type { Character } from '../../types/character';
import type { Hero } from '../../types/hero';
import type { Combat, NewFighterData } from '../../types/combat';

interface CombatSetupProps {
  combat: Combat;
  heroes: Hero[];
  characters: Character[];
  onUpdate: (patch: Partial<Combat>) => void;
  onAddFighter: (data: NewFighterData) => void;
  onRemoveFighter: (fighterId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CombatSetup({
  combat,
  heroes,
  characters,
  onUpdate,
  onAddFighter,
  onRemoveFighter,
  onNext,
  onBack,
}: CombatSetupProps) {
  const canProceed = combat.fighters.length >= 1 && combat.nome.trim().length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <header className="mb-6 text-center">
        <p className="pixel-subtitle mb-2">⚔️ FASE 1 — CADASTRO</p>
        <h1 className="pixel-title">{combat.nome || 'Novo Combate'}</h1>
      </header>

      <div className="flex flex-col gap-5">
        <PixelCard title="Configuração" icon="⏱️">
          <div className="grid gap-4 sm:grid-cols-2">
            <PixelInput
              label="Nome do encontro"
              placeholder="Ex: Emboscada na Mina Norte"
              value={combat.nome}
              onChange={e => onUpdate({ nome: e.target.value })}
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="tempo-turno" className="pixel-label">
                Minutos por turno
              </label>
              <input
                id="tempo-turno"
                type="number"
                min={1}
                max={60}
                value={combat.tempo_turno_minutos}
                onChange={e => onUpdate({ tempo_turno_minutos: Number(e.target.value) || 1 })}
                className="pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment px-3 py-2 font-sans text-base text-rpg-ink outline-none focus:border-rpg-gold"
              />
            </div>
          </div>
        </PixelCard>

        <PixelCard title="Combatentes" icon="👥">
          <AddFighterForm heroes={heroes} characters={characters} onAdd={onAddFighter} />

          {combat.fighters.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {combat.fighters.map(fighter => (
                <li key={fighter.id}>
                  <FighterSetupRow
                    fighter={fighter}
                    onRemove={() => onRemoveFighter(fighter.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </PixelCard>

        <div className="flex flex-wrap justify-between gap-3">
          <PixelButton variant="ghost" onClick={onBack}>
            Cancelar
          </PixelButton>
          <PixelButton variant="gold" onClick={onNext} disabled={!canProceed}>
            <span className="flex items-center gap-2">
              Definir iniciativa
              <ChevronRight size={14} />
            </span>
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
