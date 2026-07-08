import type { Extensions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { AudioTriggerExtension } from './extensions/AudioTriggerExtension';
import { CharacterTriggerExtension } from './extensions/CharacterTriggerExtension';

export function getStoryExtensions(options?: { placeholder?: string }): Extensions {
  const extensions: Extensions = [
    StarterKit.configure({
      heading: { levels: [2, 3] },
    }),
    Underline,
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: 'story-image',
      },
    }),
    AudioTriggerExtension,
    CharacterTriggerExtension,
  ];

  if (options?.placeholder) {
    extensions.push(Placeholder.configure({ placeholder: options.placeholder }));
  }

  return extensions;
}

export const STORY_CONTENT_CLASS = 'rich-editor-content px-4 py-3 outline-none';
