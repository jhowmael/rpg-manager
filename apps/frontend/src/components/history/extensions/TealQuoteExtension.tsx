import { Node, mergeAttributes, wrappingInputRule } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tealQuote: {
      toggleTealQuote: () => ReturnType;
    };
  }
}

/**
 * Destaque (teal). Usa <aside> no HTML salvo para não colidir com a citação
 * (<blockquote>). Ainda faz parse de blockquotes antigos com a classe.
 */
export const TealQuoteExtension = Node.create({
  name: 'tealQuote',

  group: 'block',
  content: 'block+',
  defining: true,
  priority: 60,

  parseHTML() {
    return [
      { tag: 'aside.story-teal-quote', priority: 60 },
      { tag: 'blockquote.story-teal-quote', priority: 60 },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'aside',
      mergeAttributes(HTMLAttributes, { class: 'story-teal-quote' }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleTealQuote:
        () =>
        ({ commands, editor }) => {
          if (editor.isActive(this.name)) {
            return commands.lift(this.name);
          }

          if (editor.isActive('blockquote')) {
            return commands.lift('blockquote') && commands.wrapIn(this.name);
          }

          return commands.wrapIn(this.name);
        },
    };
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: /^>\|\s$/,
        type: this.type,
      }),
    ];
  },
});
