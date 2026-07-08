import { Plus, Swords, Trash2 } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import type { Combat } from '../../types/combat';

interface CombatListProps {
  combats: Combat[];
  onCreate: () => void;
  onOpen: (combat: Combat) => void;
  onDelete: (id: string) => void;
}

const PHASE_LABELS: Record<Combat['fase'], string> = {
  setup: 'Cadastro',
  initiative: 'Iniciativa',
  battle: 'Em batalha',
  finished: 'Encerrado',
};

const PHASE_STYLES: Record<Combat['fase'], string> = {
  setup: 'border-rpg-gold-dark/50 bg-rpg-gold/10 text-rpg-gold-dark',
  initiative: 'border-rpg-mana/50 bg-rpg-mana/10 text-rpg-mana',
  battle: 'border-rpg-hp/50 bg-rpg-hp/10 text-rpg-hp',
  finished: 'border-rpg-border bg-rpg-panel text-rpg-ink-faded',
};

export function CombatList({ combats, onCreate, onOpen, onDelete }: CombatListProps) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Swords size={22} className="text-rpg-gold-dark" />
          <h1 className="pixel-title">ARENA DE COMBATE</h1>
          <Swords size={22} className="text-rpg-gold-dark" />
        </div>
        <p className="font-sans text-base text-rpg-ink-dim">
          Cadastre lutadores, defina iniciativa e conduza os turnos
        </p>
      </header>

      <PixelCard title="Combates" icon="⚔️">
        <div className="mb-4 flex justify-end">
          <PixelButton variant="gold" onClick={onCreate}>
            <span className="flex items-center gap-2">
              <Plus size={14} />
              Novo Combate
            </span>
          </PixelButton>
        </div>

        {combats.length === 0 ? (
          <div className="flex flex-col items-center gap-3 border-2 border-dashed border-rpg-border py-10 text-center">
            <span className="text-4xl opacity-50">⚔️</span>
            <p className="font-sans text-base text-rpg-ink-dim">Nenhum combate criado.</p>
            <p className="font-sans text-sm text-rpg-ink-faded">
              Crie um encontro e cadastre os combatentes.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {combats.map(combat => (
              <li
                key={combat.id}
                className="group flex flex-wrap items-center gap-3 border-2 border-rpg-border bg-rpg-parchment p-4 transition-all hover:border-rpg-gold-dark hover:shadow-pixel"
              >
                <button
                  type="button"
                  onClick={() => onOpen(combat)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        'border px-2 py-0.5 font-sans text-[10px] font-bold uppercase',
                        PHASE_STYLES[combat.fase],
                      ].join(' ')}
                    >
                      {PHASE_LABELS[combat.fase]}
                    </span>
                    <span className="font-sans text-xs text-rpg-ink-faded">
                      {combat.fighters.length} combatente
                      {combat.fighters.length !== 1 ? 's' : ''}
                    </span>
                    {combat.fase === 'battle' && (
                      <span className="font-sans text-xs text-rpg-ink-faded">
                        · Rodada {combat.rodada_atual}
                      </span>
                    )}
                  </div>
                  <h3 className="font-pixel text-pixel-xs text-rpg-ink-dark group-hover:text-rpg-gold-dark">
                    {combat.nome}
                  </h3>
                  <p className="mt-1 font-sans text-xs text-rpg-ink-faded">
                    {combat.tempo_turno_minutos} min por turno
                    {combat.fase === 'finished' && ' · clique para ver histórico'}
                  </p>
                </button>
                <button
                  type="button"
                  title="Excluir combate"
                  onClick={() => onDelete(combat.id)}
                  className="border-2 border-rpg-border bg-rpg-panel p-2 text-rpg-hp hover:border-rpg-hp hover:bg-rpg-hp/10"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </PixelCard>
    </div>
  );
}
