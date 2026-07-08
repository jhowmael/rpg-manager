import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import type { NodeViewProps } from '@tiptap/react';
import { AudioTriggerChip } from '../AudioTriggerChip';

function AudioTriggerNodeView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper as="span" className="inline">
      <AudioTriggerChip
        audioId={node.attrs.audioId}
        category={node.attrs.category}
        label={node.attrs.label}
      />
    </NodeViewWrapper>
  );
}

export const AudioTriggerExtension = Node.create({
  name: 'audioTrigger',

  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      audioId: { default: null },
      category: { default: 'sfx' },
      label: { default: 'Som' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-audio-trigger]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const el = element as HTMLElement;
          return {
            audioId: el.getAttribute('data-audio-id'),
            category: el.getAttribute('data-audio-category') ?? 'sfx',
            label: el.getAttribute('data-audio-label') ?? 'Som',
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      'span',
      mergeAttributes({
        'data-audio-trigger': '',
        'data-audio-id': node.attrs.audioId,
        'data-audio-category': node.attrs.category,
        'data-audio-label': node.attrs.label,
        contenteditable: 'false',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioTriggerNodeView);
  },
});
