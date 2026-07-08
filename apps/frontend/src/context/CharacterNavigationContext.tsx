import { createContext, useContext, type ReactNode } from 'react';

interface CharacterNavigationContextValue {
  openCharacter: (characterId: string) => void;
}

const CharacterNavigationContext = createContext<CharacterNavigationContextValue | null>(null);

interface CharacterNavigationProviderProps {
  children: ReactNode;
  onOpenCharacter: (characterId: string) => void;
}

export function CharacterNavigationProvider({
  children,
  onOpenCharacter,
}: CharacterNavigationProviderProps) {
  return (
    <CharacterNavigationContext.Provider value={{ openCharacter: onOpenCharacter }}>
      {children}
    </CharacterNavigationContext.Provider>
  );
}

export function useCharacterNavigation(): CharacterNavigationContextValue {
  const ctx = useContext(CharacterNavigationContext);
  if (!ctx) {
    throw new Error('useCharacterNavigation deve ser usado dentro de CharacterNavigationProvider');
  }
  return ctx;
}

/** Retorna null se fora do provider (ex.: preview) */
export function useCharacterNavigationOptional(): CharacterNavigationContextValue | null {
  return useContext(CharacterNavigationContext);
}
