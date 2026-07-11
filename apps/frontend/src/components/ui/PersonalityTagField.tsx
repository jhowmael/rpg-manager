import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { PERSONALITY_TAG_SUGGESTIONS } from '../../data/characterOptions';
import { PixelInput } from './PixelInput';

interface PersonalityTagFieldProps {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function PersonalityTagField({ value, onChange, disabled = false }: PersonalityTagFieldProps) {
  const [customTag, setCustomTag] = useState('');

  const toggleTag = (tag: string) => {
    if (disabled) return;
    if (value.includes(tag)) {
      onChange(value.filter(item => item !== tag));
      return;
    }
    onChange([...value, tag]);
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (!trimmed || value.includes(trimmed)) {
      setCustomTag('');
      return;
    }
    onChange([...value, trimmed]);
    setCustomTag('');
  };

  const suggestions = PERSONALITY_TAG_SUGGESTIONS.filter(tag => !value.includes(tag));

  return (
    <div className="flex flex-col gap-3">
      <label className="pixel-label">Personalidade</label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(tag => (
            <button
              key={tag}
              type="button"
              disabled={disabled}
              onClick={() => toggleTag(tag)}
              className="flex items-center gap-1 border-2 border-rpg-gold-dark bg-rpg-gold/15 px-2.5 py-1 font-sans text-xs font-semibold text-rpg-ink-dark transition-colors hover:bg-rpg-gold/25 disabled:opacity-60"
            >
              {tag}
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {suggestions.map(tag => (
          <button
            key={tag}
            type="button"
            disabled={disabled}
            onClick={() => toggleTag(tag)}
            className="border-2 border-rpg-border bg-rpg-panel px-2.5 py-1 font-sans text-xs font-semibold text-rpg-ink-dim transition-colors hover:border-rpg-gold-dark hover:bg-rpg-gold/10 disabled:opacity-60"
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <PixelInput
            label="Adicionar traço"
            placeholder="Ex: Vingativo"
            value={customTag}
            onChange={e => setCustomTag(e.target.value)}
            disabled={disabled}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomTag();
              }
            }}
          />
        </div>
        <button
          type="button"
          disabled={disabled || !customTag.trim()}
          onClick={addCustomTag}
          className="flex h-[42px] items-center justify-center gap-1 border-2 border-rpg-border bg-rpg-parchment px-4 font-sans text-sm font-semibold text-rpg-ink-dim transition-colors hover:border-rpg-gold-dark hover:text-rpg-ink-dark disabled:opacity-60"
        >
          <Plus size={14} />
          Adicionar
        </button>
      </div>

      <p className="font-sans text-xs text-rpg-ink-faded">
        Clique nas sugestões para adicionar ou remover traços de personalidade.
      </p>
    </div>
  );
}
