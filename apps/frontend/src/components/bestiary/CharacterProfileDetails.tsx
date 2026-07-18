import type { Character, CharacterAttributes } from '../../types/character';
import { getCharacterMetaItems, normalizePersonality } from '../../utils/characterProfile';

interface CharacterProfileDetailsProps {
  character: Character;
  compact?: boolean;
}

const ATTRIBUTE_FIELDS: { key: keyof CharacterAttributes; label: string }[] = [
  { key: 'forca', label: 'FOR' },
  { key: 'destreza', label: 'DES' },
  { key: 'constituicao', label: 'CON' },
  { key: 'inteligencia', label: 'INT' },
  { key: 'sabedoria', label: 'SAB' },
  { key: 'carisma', label: 'CAR' },
];

export function CharacterProfileDetails({ character, compact = false }: CharacterProfileDetailsProps) {
  const meta = getCharacterMetaItems(character);
  const traits = normalizePersonality(character.personalidade);
  const atributos = character.atributos;
  const habilidades = character.habilidades ?? [];

  return (
    <div className="flex flex-col gap-4">
      {meta.length > 0 && (
        <section className="border-2 border-rpg-border bg-rpg-parchment p-5 shadow-pixel">
          <h2 className="pixel-card-title mb-3 flex items-center gap-2">
            <span>🛡️</span>
            Ficha rápida
          </h2>
          <div className="flex flex-wrap gap-2">
            {meta.map(item => (
              <span
                key={item.label}
                className="border-2 border-rpg-border bg-rpg-panel px-3 py-1 font-sans text-sm text-rpg-ink-dark"
              >
                <span className="font-bold text-rpg-ink-dim">{item.label}:</span>{' '}
                {item.value}
              </span>
            ))}
          </div>
        </section>
      )}

      {atributos && (
        <section className="border-2 border-rpg-border bg-rpg-parchment p-5 shadow-pixel">
          <h2 className="pixel-card-title mb-3 flex items-center gap-2">
            <span>⚔️</span>
            Atributos
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {ATTRIBUTE_FIELDS.map(({ key, label }) => (
              <div
                key={key}
                className="flex flex-col items-center border-2 border-rpg-border bg-rpg-panel px-2 py-3"
              >
                <span className="pixel-label mb-1">{label}</span>
                <span className="font-sans text-lg font-bold text-rpg-ink-dark">
                  {atributos[key]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {habilidades.length > 0 && (
        <section className="border-2 border-rpg-border bg-rpg-parchment p-5 shadow-pixel">
          <h2 className="pixel-card-title mb-3 flex items-center gap-2">
            <span>✨</span>
            Habilidades
          </h2>
          <ul className="flex flex-col gap-2">
            {habilidades.map(habilidade => (
              <li
                key={habilidade.id}
                className="border-2 border-rpg-border bg-rpg-panel px-3 py-2"
              >
                <p className="font-sans text-sm font-semibold text-rpg-ink-dark">
                  {habilidade.nome}
                </p>
                {habilidade.descricao && (
                  <p
                    className={[
                      'mt-0.5 whitespace-pre-wrap font-sans leading-relaxed text-rpg-ink-dim',
                      compact ? 'text-sm' : 'text-base',
                    ].join(' ')}
                  >
                    {habilidade.descricao}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <DetailSection title="História" icon="📖" content={character.historia} compact={compact} />
      <DetailSection
        title="Características"
        icon="🧬"
        content={character.caracteristicas}
        compact={compact}
      />
      <DetailSection title="O que sabe" icon="🧠" content={character.o_que_sabe} compact={compact} />

      <section className="border-2 border-rpg-border bg-rpg-parchment p-5 shadow-pixel">
        <h2 className="pixel-card-title mb-3 flex items-center gap-2">
          <span>🎭</span>
          Personalidade
        </h2>
        {traits.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {traits.map(tag => (
              <span
                key={tag}
                className="border-2 border-rpg-gold-dark bg-rpg-gold/10 px-2.5 py-1 font-sans text-sm font-semibold text-rpg-ink-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="font-sans text-base leading-relaxed text-rpg-ink-dim">
            Sem traços registrados.
          </p>
        )}
      </section>

      <DetailSection
        title="Família & Relações"
        icon="👨‍👩‍👧"
        content={character.familia_relacoes}
        compact={compact}
      />
    </div>
  );
}

function DetailSection({
  title,
  icon,
  content,
  compact,
}: {
  title: string;
  icon: string;
  content?: string;
  compact?: boolean;
}) {
  return (
    <section className="border-2 border-rpg-border bg-rpg-parchment p-5 shadow-pixel">
      <h2 className="pixel-card-title mb-3 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h2>
      <p
        className={[
          'whitespace-pre-wrap font-sans leading-relaxed text-rpg-ink-dim',
          compact ? 'text-sm' : 'text-base',
        ].join(' ')}
      >
        {content || 'Sem informação registrada.'}
      </p>
    </section>
  );
}
