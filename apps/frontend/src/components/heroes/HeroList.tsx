import { Plus } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';
import { HeroCard } from './HeroCard';
import type { Hero } from '../../types/hero';

interface HeroListProps {
  heroes: Hero[];
  onCreate: () => void;
  onView: (hero: Hero) => void;
  onEdit: (hero: Hero) => void;
  onDelete: (id: string) => void;
}

export function HeroList({ heroes, onCreate, onView, onEdit, onDelete }: HeroListProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="text-2xl">🛡️</span>
          <h1 className="pixel-title">HERÓIS</h1>
          <span className="text-2xl">🛡️</span>
        </div>
        <p className="font-sans text-base text-rpg-ink-dim">
          Jogadores e personagens da mesa
        </p>
      </header>

      <PixelCard title="Jogadores" icon="⚔️">
        <div className="mb-4 flex justify-end">
          <PixelButton variant="gold" onClick={onCreate}>
            <span className="flex items-center gap-2">
              <Plus size={14} />
              Novo Herói
            </span>
          </PixelButton>
        </div>

        {heroes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 border-2 border-dashed border-rpg-border py-10 text-center">
            <span className="text-4xl opacity-50">🛡️</span>
            <p className="font-sans text-base text-rpg-ink-dim">Nenhum herói cadastrado.</p>
            <p className="font-sans text-sm text-rpg-ink-faded">
              Adicione os personagens dos jogadores da campanha.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {heroes.map(hero => (
              <li key={hero.id}>
                <HeroCard
                  hero={hero}
                  onView={() => onView(hero)}
                  onEdit={() => onEdit(hero)}
                  onDelete={() => onDelete(hero.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </PixelCard>
    </div>
  );
}
