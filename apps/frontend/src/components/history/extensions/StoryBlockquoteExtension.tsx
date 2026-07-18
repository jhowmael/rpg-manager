import { Blockquote } from '@tiptap/extension-blockquote';

/**
 * Citação padrão (dourada). Ignora blockquotes com a classe do destaque
 * para não conflitar com TealQuote na reabertura do HTML salvo.
 */
export const StoryBlockquoteExtension = Blockquote.extend({
  parseHTML() {
    return [
      {
        tag: 'blockquote',
        getAttrs: (node) => {
          if (typeof node === 'string') return false;
          const el = node as HTMLElement;
          if (el.classList?.contains('story-teal-quote')) return false;
          return null;
        },
      },
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      toggleBlockquote:
        () =>
        ({ commands, editor }) => {
          if (editor.isActive('blockquote')) {
            return commands.lift('blockquote');
          }

          if (editor.isActive('tealQuote')) {
            return commands.lift('tealQuote') && commands.wrapIn('blockquote');
          }

          return commands.wrapIn('blockquote');
        },
    };
  },
});
