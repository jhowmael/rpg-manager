import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import type { NavModuleId } from '../../data/navigation';
import type { Campaign } from '../../types/campaign';

interface AppLayoutProps {
  children: ReactNode;
  activeModule: NavModuleId;
  selectedCampaign: Campaign | null;
  onNavigate: (module: NavModuleId) => void;
}

export function AppLayout({
  children,
  activeModule,
  selectedCampaign,
  onNavigate,
}: AppLayoutProps) {
  return (
    <div className="scanlines flex min-h-screen flex-col lg:flex-row lg:overflow-hidden">
      <Sidebar
        activeModule={activeModule}
        selectedCampaign={selectedCampaign}
        onNavigate={onNavigate}
      />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:h-screen">
        <header className="flex items-center justify-between border-b-2 border-rpg-border bg-rpg-panel px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div>
              <span className="pixel-subtitle">MESTRE DOS MAGOS</span>
              {selectedCampaign && (
                <p className="mt-0.5 font-sans text-sm font-semibold text-rpg-ink-dark">
                  📜 {selectedCampaign.nome}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 border-2 border-rpg-border bg-rpg-parchment px-2.5 py-1.5 shadow-pixel">
              <span className="inline-block text-base leading-none animate-heartbeat" aria-hidden>
                ❤️
              </span>
              <span className="font-bold tabular-nums text-rpg-hp">---</span>
            </div>

            <div className="flex items-center gap-1.5 border-2 border-rpg-border bg-rpg-parchment px-2.5 py-1.5 shadow-pixel [perspective:120px]">
              <span className="inline-block text-base leading-none animate-coin-spin [transform-style:preserve-3d]" aria-hidden>
                🪙
              </span>
              <span className="font-bold tabular-nums text-rpg-gold-dark">---</span>
            </div>

            <div className="flex items-center gap-1.5 border-2 border-rpg-border bg-rpg-parchment px-2.5 py-1.5 shadow-pixel">
              <span className="inline-block text-base leading-none animate-sparkle" aria-hidden>
                ✨
              </span>
              <span className="font-bold tabular-nums text-rpg-mana">---</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
