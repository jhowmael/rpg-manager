import type { TextareaHTMLAttributes } from 'react';

interface PixelTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function PixelTextarea({ label, id, className = '', ...props }: PixelTextareaProps) {
  const textareaId = id ?? label.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={textareaId} className="pixel-label">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={[
          'pixel-corners min-h-[120px] w-full resize-y border-2 border-rpg-border bg-rpg-parchment px-3 py-3',
          'font-sans text-base text-rpg-ink outline-none',
          'placeholder:text-rpg-ink-faded focus:border-rpg-gold focus:shadow-[0_0_0_2px_rgba(184,134,11,0.25)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    </div>
  );
}
