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
          <div className="flex items-center gap-4 font-sans text-sm">
            <span className="hidden text-rpg-hp sm:inline">HP ████████░░</span>
            <span className="text-rpg-gold-dark">🪙 ---</span>
            <span className="text-rpg-mana">✨ ---</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
