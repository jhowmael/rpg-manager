import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import type { NodeViewProps } from '@tiptap/react';
import { MapTriggerChip } from '../MapTriggerChip';

function MapTriggerNodeView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper as="div" className="my-2">
      <MapTriggerChip
        mapId={node.attrs.mapId}
        nome={node.attrs.nome}
        imagemId={node.attrs.imagemId}
      />
    </NodeViewWrapper>
  );
}

export const MapTriggerExtension = Node.create({
  name: 'mapTrigger',

  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      mapId: { default: null },
      nome: { default: 'Mapa' },
      imagemId: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-map-trigger]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const el = element as HTMLElement;
          return {
            mapId: el.getAttribute('data-map-id'),
            nome: el.getAttribute('data-map-nome') ?? 'Mapa',
            imagemId: el.getAttribute('data-map-imagem-id') || null,
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      'div',
      mergeAttributes({
        'data-map-trigger': '',
        'data-map-id': node.attrs.mapId,
        'data-map-nome': node.attrs.nome,
        'data-map-imagem-id': node.attrs.imagemId ?? '',
        contenteditable: 'false',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MapTriggerNodeView);
  },
});
