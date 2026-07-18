import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import type { Editor } from '@tiptap/core';
import { useEditor, EditorContent } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Undo,
  Redo,
  ImagePlus,
} from 'lucide-react';
import { EditorSidePanel } from './EditorSidePanel';
import { getStoryExtensions, STORY_CONTENT_CLASS } from './storyExtensions';
import { AUDIO_DRAG_TYPE, type AudioDragPayload } from '../../data/soundLibrary';
import { CHARACTER_DRAG_TYPE, type CharacterDragPayload } from '../../data/characterDrag';
import { MAP_DRAG_TYPE, type MapDragPayload } from '../../data/mapDrag';
import { readImageAsDataUrl, validateImageFile } from '../../utils/imageUpload';
import type { Character } from '../../types/character';
import type { CampaignMap } from '../../types/map';

export interface RichTextEditorHandle {
  getHTML: () => string;
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  characters?: Character[];
  maps?: CampaignMap[];
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={[
        'flex h-8 w-8 items-center justify-center border-2 transition-colors',
        active
          ? 'border-rpg-gold-dark bg-rpg-gold/20 text-rpg-ink-dark'
          : 'border-rpg-border bg-rpg-parchment text-rpg-ink-dim hover:border-rpg-gold-dark hover:bg-rpg-gold/10',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function insertImage(editor: Editor, src: string, pos?: number) {
  const node = {
    type: 'image',
    attrs: { src },
  };

  if (pos !== undefined) {
    editor.chain().insertContentAt(pos, node).run();
  } else {
    editor.chain().focus().insertContent(node).run();
  }
}

function insertAudioTrigger(editor: Editor, payload: AudioDragPayload, pos?: number) {
  const node = {
    type: 'audioTrigger',
    attrs: {
      audioId: payload.audioId,
      category: payload.category,
      label: payload.label,
    },
  };

  if (pos !== undefined) {
    editor.chain().insertContentAt(pos, node).run();
  } else {
    editor.chain().focus().insertContent(node).run();
  }
}

function insertCharacterTrigger(editor: Editor, payload: CharacterDragPayload, pos?: number) {
  const node = {
    type: 'characterTrigger',
    attrs: {
      characterId: payload.characterId,
      nome: payload.nome,
      tipo: payload.tipo,
    },
  };

  if (pos !== undefined) {
    editor.chain().insertContentAt(pos, node).run();
  } else {
    editor.chain().focus().insertContent(node).run();
  }
}

function insertMapTrigger(editor: Editor, payload: MapDragPayload, pos?: number) {
  const node = {
    type: 'mapTrigger',
    attrs: {
      mapId: payload.mapId,
      nome: payload.nome,
      imagemId: payload.imagemId ?? null,
    },
  };

  if (pos !== undefined) {
    editor.chain().insertContentAt(pos, node).run();
  } else {
    editor.chain().focus().insertContent(node).run();
  }
}

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(function RichTextEditor({
  content,
  onChange,
  placeholder = 'Escreva a história aqui…',
  characters = [],
  maps = [],
}, ref) {
  const editorRef = useRef<Editor | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const syncContent = useCallback(() => {
    const ed = editorRef.current;
    if (ed) onChange(ed.getHTML());
  }, [onChange]);

  const handleImageFile = useCallback(async (file: File, pos?: number) => {
    const ed = editorRef.current;
    if (!ed) return;

    const error = validateImageFile(file);
    if (error) {
      window.alert(error);
      return;
    }

    try {
      const dataUrl = await readImageAsDataUrl(file);
      insertImage(ed, dataUrl, pos);
    } catch {
      window.alert('Não foi possível carregar a imagem.');
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getHTML: () => editorRef.current?.getHTML() ?? content,
  }), [content]);

  const editor = useEditor({
    extensions: getStoryExtensions({ placeholder }),
    content,
    onCreate: ({ editor: ed }) => {
      editorRef.current = ed;
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: `${STORY_CONTENT_CLASS} min-h-[280px]`,
      },
      handleDrop: (view, event) => {
        const ed = editorRef.current;
        if (!ed) return false;

        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        const imageFile = Array.from(event.dataTransfer?.files ?? []).find(file =>
          file.type.startsWith('image/'),
        );
        if (imageFile) {
          event.preventDefault();
          void handleImageFile(imageFile, coordinates?.pos);
          return true;
        }

        const characterRaw = event.dataTransfer?.getData(CHARACTER_DRAG_TYPE);
        if (characterRaw) {
          event.preventDefault();
          const payload = JSON.parse(characterRaw) as CharacterDragPayload;
          if (coordinates) {
            insertCharacterTrigger(ed, payload, coordinates.pos);
          } else {
            insertCharacterTrigger(ed, payload);
          }
          return true;
        }

        const mapRaw = event.dataTransfer?.getData(MAP_DRAG_TYPE);
        if (mapRaw) {
          event.preventDefault();
          const payload = JSON.parse(mapRaw) as MapDragPayload;
          if (coordinates) {
            insertMapTrigger(ed, payload, coordinates.pos);
          } else {
            insertMapTrigger(ed, payload);
          }
          return true;
        }

        const audioRaw = event.dataTransfer?.getData(AUDIO_DRAG_TYPE);
        if (!audioRaw) return false;

        event.preventDefault();
        const payload = JSON.parse(audioRaw) as AudioDragPayload;

        if (coordinates) {
          insertAudioTrigger(ed, payload, coordinates.pos);
        } else {
          insertAudioTrigger(ed, payload);
        }

        return true;
      },
      handleDOMEvents: {
        dragover: (_view, event) => {
          const types = event.dataTransfer?.types ?? [];
          const hasImageFile = Array.from(event.dataTransfer?.items ?? []).some(
            item => item.kind === 'file' && item.type.startsWith('image/'),
          );
          if (
            hasImageFile ||
            types.includes(AUDIO_DRAG_TYPE) ||
            types.includes(CHARACTER_DRAG_TYPE) ||
            types.includes(MAP_DRAG_TYPE)
          ) {
            event.preventDefault();
            return true;
          }
          return false;
        },
        paste: (_view, event) => {
          const ed = editorRef.current;
          if (!ed) return false;

          const imageItem = Array.from(event.clipboardData?.items ?? []).find(
            item => item.kind === 'file' && item.type.startsWith('image/'),
          );
          const file = imageItem?.getAsFile();
          if (!file) return false;

          event.preventDefault();
          void handleImageFile(file);
          return true;
        },
      },
    },
  });

  useEffect(() => {
    const ed = editorRef.current;
    if (!ed || ed.isDestroyed) return;
    if (content !== ed.getHTML()) {
      ed.commands.setContent(content, { emitUpdate: false });
    }
  }, [content]);

  const handleInsertAudio = useCallback((payload: AudioDragPayload) => {
    if (editorRef.current) {
      insertAudioTrigger(editorRef.current, payload);
      syncContent();
    }
  }, [syncContent]);

  const handleInsertCharacter = useCallback((payload: CharacterDragPayload) => {
    if (editorRef.current) {
      insertCharacterTrigger(editorRef.current, payload);
      syncContent();
    }
  }, [syncContent]);

  const handleInsertMap = useCallback((payload: MapDragPayload) => {
    if (editorRef.current) {
      insertMapTrigger(editorRef.current, payload);
      syncContent();
    }
  }, [syncContent]);

  const handleImageInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void handleImageFile(file);
      event.target.value = '';
    },
    [handleImageFile],
  );

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
      <div className="rich-editor min-w-0 flex-1 border-2 border-rpg-border bg-rpg-parchment shadow-pixel">
        <div className="flex flex-wrap gap-1 border-b-2 border-rpg-border bg-rpg-panel p-2">
          <ToolbarButton
            title="Negrito"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Itálico"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Sublinhado"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
          >
            <UnderlineIcon size={16} />
          </ToolbarButton>

          <span className="mx-1 w-px self-stretch bg-rpg-border" />

          <ToolbarButton
            title="Título"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Lista com marcadores"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Lista numerada"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
          >
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Citação"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
          >
            <Quote size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Destaque"
            onClick={() => editor.chain().focus().toggleTealQuote().run()}
            active={editor.isActive('tealQuote')}
          >
            <Quote size={16} className="text-rpg-mana" />
          </ToolbarButton>

          <span className="mx-1 w-px self-stretch bg-rpg-border" />

          <ToolbarButton
            title="Inserir imagem"
            onClick={() => imageInputRef.current?.click()}
          >
            <ImagePlus size={16} />
          </ToolbarButton>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleImageInputChange}
          />

          <span className="mx-1 w-px self-stretch bg-rpg-border" />

          <ToolbarButton title="Desfazer" onClick={() => editor.chain().focus().undo().run()}>
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton title="Refazer" onClick={() => editor.chain().focus().redo().run()}>
            <Redo size={16} />
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} />
      </div>

      <EditorSidePanel
        characters={characters}
        maps={maps}
        onInsertCharacter={handleInsertCharacter}
        onInsertMap={handleInsertMap}
        onInsertAudio={handleInsertAudio}
      />
    </div>
  );
});
