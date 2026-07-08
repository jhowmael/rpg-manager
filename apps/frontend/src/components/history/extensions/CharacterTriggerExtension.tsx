import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import type { NodeViewProps } from '@tiptap/react';
import { CharacterTriggerChip } from '../CharacterTriggerChip';

function CharacterTriggerNodeView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper as="span" className="inline">
      <CharacterTriggerChip
        characterId={node.attrs.characterId}
        nome={node.attrs.nome}
        tipo={node.attrs.tipo}
      />
    </NodeViewWrapper>
  );
}

export const CharacterTriggerExtension = Node.create({
  name: 'characterTrigger',

  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      characterId: { default: null },
      nome: { default: 'Personagem' },
      tipo: { default: 'NPC' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-character-trigger]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const el = element as HTMLElement;
          return {
            characterId: el.getAttribute('data-character-id'),
            nome: el.getAttribute('data-character-nome') ?? 'Personagem',
            tipo: el.getAttribute('data-character-tipo') ?? 'NPC',
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      'span',
      mergeAttributes({
        'data-character-trigger': '',
        'data-character-id': node.attrs.characterId,
        'data-character-nome': node.attrs.nome,
        'data-character-tipo': node.attrs.tipo,
        contenteditable: 'false',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CharacterTriggerNodeView);
  },
});
