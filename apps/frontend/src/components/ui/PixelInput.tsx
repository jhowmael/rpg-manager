import type { InputHTMLAttributes } from 'react';

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function PixelInput({ label, id, className = '', ...props }: PixelInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="pixel-label">
        {label}
      </label>
      <input
        id={inputId}
        className={[
          'pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment px-3 py-3',
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
