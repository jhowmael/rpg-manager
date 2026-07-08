import { useCharacterNavigationOptional } from '../../context/CharacterNavigationContext';
import { getCharacterEmoji, type CharacterType } from '../../types/character';

interface CharacterTriggerChipProps {
  characterId: string;
  nome: string;
  tipo: string;
}

export function CharacterTriggerChip({ characterId, nome, tipo }: CharacterTriggerChipProps) {
  const navigation = useCharacterNavigationOptional();
  const charType = (tipo === 'MOB' ? 'MOB' : 'NPC') as CharacterType;
  const emoji = getCharacterEmoji(charType);
  const isMob = charType === 'MOB';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigation?.openCharacter(characterId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Ver ficha: ${nome}`}
      className={[
        'character-trigger-chip mx-0.5 inline-flex items-center gap-1 border-2 px-2 py-0.5 font-sans text-xs font-semibold transition-all',
        isMob
          ? 'border-rpg-hp bg-rpg-hp/10 text-rpg-hp hover:bg-rpg-hp/20'
          : 'border-rpg-forest bg-rpg-forest/10 text-rpg-forest hover:bg-rpg-forest/20',
      ].join(' ')}
      data-character-id={characterId}
      data-character-nome={nome}
      data-character-tipo={tipo}
    >
      <span>{emoji}</span>
      <span>{nome}</span>
    </button>
  );
}
