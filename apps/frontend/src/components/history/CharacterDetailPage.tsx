import { ArrowLeft } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { EntityImage } from '../ui/EntityImage';
import type { Character } from '../../types/character';
import { getCharacterEmoji } from '../../types/character';

interface CharacterDetailPageProps {
  character: Character;
  onBack: () => void;
}

export function CharacterDetailPage({ character, onBack }: CharacterDetailPageProps) {
  const emoji = getCharacterEmoji(character.tipo);
  const isMob = character.tipo === 'MOB';

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
              <span
                className={[
                  'mt-3 inline-block w-fit border px-3 py-1 font-sans text-xs font-bold uppercase',
                  isMob
                    ? 'border-rpg-hp bg-rpg-hp/10 text-rpg-hp'
                    : 'border-rpg-forest bg-rpg-forest/10 text-rpg-forest',
                ].join(' ')}
              >
                {character.tipo}
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4">
          <DetailSection title="História" icon="📖" content={character.historia} />
          <DetailSection title="O que sabe" icon="🧠" content={character.o_que_sabe} />
          <DetailSection title="Personalidade" icon="🎭" content={character.personalidade} />
          <DetailSection title="Família & Relações" icon="👨‍👩‍👧" content={character.familia_relacoes} />
        </div>

        <div className="mt-8">
          <PixelButton variant="ghost" onClick={onBack}>
            Voltar
          </PixelButton>
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  icon,
  content,
}: {
  title: string;
  icon: string;
  content?: string;
}) {
  return (
    <section className="border-2 border-rpg-border bg-rpg-parchment p-5 shadow-pixel">
      <h2 className="pixel-card-title mb-3 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h2>
      <p className="whitespace-pre-wrap font-sans text-base leading-relaxed text-rpg-ink-dim">
        {content || 'Sem informação registrada.'}
      </p>
    </section>
  );
}
