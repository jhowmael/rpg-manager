import { GripVertical, Users } from 'lucide-react';
import { CharacterPalette } from './CharacterPalette';
import { MapPalette } from './MapPalette';
import { AudioPalette } from './AudioPalette';
import type { CharacterDragPayload } from '../../data/characterDrag';
import type { MapDragPayload } from '../../data/mapDrag';
import type { AudioDragPayload } from '../../data/soundLibrary';
import type { Character } from '../../types/character';
import type { CampaignMap } from '../../types/map';

interface EditorSidePanelProps {
  characters: Character[];
  maps: CampaignMap[];
  onInsertCharacter: (payload: CharacterDragPayload) => void;
  onInsertMap: (payload: MapDragPayload) => void;
  onInsertAudio: (payload: AudioDragPayload) => void;
}

export function EditorSidePanel({
  characters,
  maps,
  onInsertCharacter,
  onInsertMap,
  onInsertAudio,
}: EditorSidePanelProps) {
  return (
    <aside className="w-full shrink-0 lg:w-64 xl:w-72 lg:sticky lg:top-4 lg:self-start">
      <div className="flex max-h-[min(70vh,32rem)] flex-col overflow-hidden border-2 border-rpg-border bg-rpg-panel shadow-pixel lg:max-h-[calc(100dvh-5.5rem)]">
        <header className="shrink-0 border-b-2 border-rpg-border bg-rpg-parchment/60 px-3 py-2.5">
          <p className="pixel-label flex items-center gap-2 text-[10px]">
            <Users size={12} />
            Inserir no texto
          </p>
          <p className="mt-1 font-sans text-[10px] leading-snug text-rpg-ink-faded">
            Arraste ou clique no item para inserir no cursor.
          </p>
        </header>

        <div className="panel-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-2.5">
          <div className="flex flex-col gap-4">
            <CharacterPalette
              characters={characters}
              onInsert={onInsertCharacter}
              embedded
            />
            <MapPalette maps={maps} onInsert={onInsertMap} embedded />
            <AudioPalette onInsert={onInsertAudio} embedded />
          </div>
        </div>

        <footer className="shrink-0 border-t border-dashed border-rpg-border bg-rpg-parchment/40 px-3 py-2">
          <p className="flex items-center gap-1 font-sans text-[9px] leading-snug text-rpg-ink-faded">
            <GripVertical size={10} className="shrink-0 opacity-60" />
            Sons: 2x clique pré-ouve · NPCs: 2x clique = ficha · Mapas: olho/miniatura = zoom
          </p>
        </footer>
      </div>
    </aside>
  );
}
