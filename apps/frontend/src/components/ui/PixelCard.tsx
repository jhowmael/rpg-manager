import type { ReactNode } from 'react';

interface PixelCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PixelCard({ title, icon, children, className = '' }: PixelCardProps) {
  return (
    <section
      className={[
        'pixel-corners border-2 border-rpg-border bg-rpg-panel p-5 shadow-pixel',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="mb-5 flex items-center gap-3 border-b-2 border-dashed border-rpg-border pb-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <h2 className="pixel-card-title leading-relaxed">{title}</h2>
      </header>
      {children}
    </section>
  );
}
