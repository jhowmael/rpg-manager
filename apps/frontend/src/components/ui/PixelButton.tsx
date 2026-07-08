import type { ButtonHTMLAttributes, ReactNode } from 'react';

type PixelButtonVariant = 'gold' | 'forest' | 'ghost' | 'hp';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: PixelButtonVariant;
  fullWidth?: boolean;
}

const variantStyles: Record<PixelButtonVariant, string> = {
  gold: 'bg-rpg-gold text-rpg-parchment border-rpg-gold-dark shadow-pixel-gold hover:bg-rpg-gold-light active:translate-x-1 active:translate-y-1 active:shadow-none',
  forest: 'bg-rpg-forest text-rpg-parchment border-rpg-border-dark shadow-pixel-dark hover:bg-rpg-forest-dim active:translate-x-1 active:translate-y-1 active:shadow-none',
  ghost: 'bg-rpg-panel text-rpg-ink border-rpg-border shadow-pixel hover:border-rpg-gold-dark hover:bg-rpg-parchment active:translate-x-1 active:translate-y-1 active:shadow-none',
  hp: 'bg-rpg-hp text-rpg-parchment border-rpg-border-dark shadow-pixel-dark hover:brightness-110 active:translate-x-1 active:translate-y-1 active:shadow-none',
};

export function PixelButton({
  children,
  variant = 'gold',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: PixelButtonProps) {
  return (
    <button
      className={[
        'pixel-corners border-2 px-4 py-3 font-pixel text-pixel-xs uppercase tracking-wide transition-all',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-x-0 disabled:active:translate-y-0',
        fullWidth ? 'w-full' : '',
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
