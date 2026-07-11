import { ArrowLeft } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { EntityImage } from '../ui/EntityImage';
import { CharacterProfileDetails } from '../bestiary/CharacterProfileDetails';
import type { Character } from '../../types/character';
import { getCharacterEmoji } from '../../types/character';
import { getCharacterMetaItems } from '../../utils/characterProfile';

interface CharacterDetailPageProps {
  character: Character;
  onBack: () => void;
}

export function CharacterDetailPage({ character, onBack }: CharacterDetailPageProps) {
  const emoji = getCharacterEmoji(character.tipo);
  const isMob = character.tipo === 'MOB';
  const meta = getCharacterMetaItems(character);

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-rpg-void/95 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
        >
          <ArrowLeft size={16} />
          Voltar para a história
        </button>

        <header className="mb-6 overflow-hidden border-2 border-rpg-border bg-rpg-panel shadow-pixel">
          <div className="flex flex-col sm:flex-row">
            <div className="aspect-square w-full shrink-0 overflow-hidden border-b-2 border-rpg-border bg-rpg-parchment sm:w-40 sm:border-b-0 sm:border-r-2">
              <EntityImage
                imagemId={character.imagem_id}
                alt={character.nome}
                fallbackEmoji={emoji}
                fallbackClassName="text-5xl"
                containerClassName="h-full min-h-[10rem] w-full sm:min-h-0"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-6">
              <p className="pixel-subtitle mb-1">
                {isMob ? '💀 MOB / CRIATURA' : '👤 NPC'}
              </p>
              <h1 className="pixel-title">{character.nome}</h1>
              {character.titulo && (
                <p className="mt-2 font-sans text-base font-semibold text-rpg-gold-dark">
                  {character.titulo}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={[
                    'inline-block border px-3 py-1 font-sans text-xs font-bold uppercase',
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

        <CharacterProfileDetails character={character} compact />

        <div className="mt-8">
          <PixelButton variant="ghost" onClick={onBack}>
            Voltar
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
