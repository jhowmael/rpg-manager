import type { ReactNode } from 'react';

interface PlaceholderPageProps {
  emoji: string;
  title: string;
  subtitle: string;
  campaignName: string;
}

export function PlaceholderPage({ emoji, title, subtitle, campaignName }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mb-6 text-6xl animate-float">{emoji}</div>
      <h1 className="pixel-title mb-3 leading-loose">{title}</h1>
      <p className="mb-2 font-sans text-lg text-rpg-ink-dim">{subtitle}</p>
      <p className="font-sans text-base text-rpg-ink-faded">
        Campanha ativa: <span className="font-semibold text-rpg-ink-dark">{campaignName}</span>
      </p>
      <div className="mt-8 border-2 border-dashed border-rpg-border bg-rpg-panel px-6 py-8 shadow-pixel">
        <p className="pixel-subtitle leading-relaxed">
          MÓDULO EM CONSTRUÇÃO
        </p>
        <p className="mt-3 font-sans text-base text-rpg-ink-dim">
          Esta tela será implementada no próximo passo.
        </p>
      </div>
    </div>
  );
}

interface ModulePlaceholderProps {
  campaignName: string;
  emoji: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export function ModulePlaceholder({
  campaignName,
  emoji,
  title,
  subtitle,
  children,
}: ModulePlaceholderProps) {
  return (
    <div>
      <PlaceholderPage
        emoji={emoji}
        title={title}
        subtitle={subtitle}
        campaignName={campaignName}
      />
      {children}
    </div>
  );
}
