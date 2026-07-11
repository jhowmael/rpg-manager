import { ArrowLeft, Edit } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { EntityImage } from '../ui/EntityImage';
import { CharacterProfileDetails } from './CharacterProfileDetails';
import type { Character } from '../../types/character';
import { getCharacterEmoji } from '../../types/character';
import { getCharacterMetaItems } from '../../utils/characterProfile';

interface CharacterViewerProps {
  character: Character;
  onBack: () => void;
  onEdit: () => void;
}

export function CharacterViewer({ character, onBack, onEdit }: CharacterViewerProps) {
  const isMob = character.tipo === 'MOB';
  const meta = getCharacterMetaItems(character);

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar para o grimório
      </button>

      <header className="mb-6 overflow-hidden border-2 border-rpg-border bg-rpg-panel shadow-pixel">
        <div className="flex flex-col sm:flex-row">
          <div className="aspect-square w-full shrink-0 overflow-hidden border-b-2 border-rpg-border bg-rpg-parchment sm:w-48 sm:border-b-0 sm:border-r-2">
            <EntityImage
              imagemId={character.imagem_id}
              alt={character.nome}
              fallbackEmoji={getCharacterEmoji(character.tipo)}
              fallbackClassName="text-6xl"
              containerClassName="h-full min-h-[12rem] w-full sm:min-h-0"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center p-6">
            <p className="pixel-subtitle mb-2">
              {isMob ? '💀 MOB / CRIATURA' : '👤 NPC'}
            </p>
            <h1 className="pixel-title mb-2">{character.nome}</h1>
            {character.titulo && (
              <p className="font-sans text-base font-semibold text-rpg-gold-dark">
                {character.titulo}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={[
                  'inline-block w-fit border px-3 py-1 font-sans text-xs font-bold uppercase',
                  isMob
                    ? 'border-rpg-hp bg-rpg-hp/10 text-rpg-hp'
                    : 'border-rpg-forest bg-rpg-forest/10 text-rpg-forest',
                ].join(' ')}
              >
                {character.tipo}
              </span>
              {meta.map(item => (
                <span
                  key={item.label}
                  className="border border-rpg-border bg-rpg-parchment px-2.5 py-1 font-sans text-xs text-rpg-ink-dim"
                >
                  {item.label}: <span className="font-semibold text-rpg-ink-dark">{item.value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <CharacterProfileDetails character={character} />

      <div className="mt-8 flex flex-wrap gap-3">
        <PixelButton variant="gold" onClick={onEdit}>
          <span className="flex items-center gap-2">
            <Edit size={14} />
            Editar
          </span>
        </PixelButton>
        <PixelButton variant="ghost" onClick={onBack}>
          Voltar
        </PixelButton>
      </div>
    </div>
  );
}
