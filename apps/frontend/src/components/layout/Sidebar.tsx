import { Lock } from 'lucide-react';
import { NAV_ITEMS, type NavModuleId } from '../../data/navigation';
import type { Campaign } from '../../types/campaign';

interface SidebarProps {
  activeModule: NavModuleId;
  selectedCampaign: Campaign | null;
  onNavigate: (module: NavModuleId) => void;
}

export function Sidebar({ activeModule, selectedCampaign, onNavigate }: SidebarProps) {
  const hasCampaign = selectedCampaign !== null;

  return (
    <aside className="flex w-full shrink-0 flex-col border-b-4 border-rpg-gold-dark bg-rpg-dark lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r-4 lg:overflow-y-auto">
      {/* Logo / Brand */}
      <div className="border-b-2 border-dashed border-rpg-border px-4 py-5 text-center lg:py-6">
        <div className="mb-2 text-3xl animate-float">🧙‍♂️</div>
        <p className="pixel-subtitle leading-relaxed">RPG MANAGER</p>
        <p className="mt-1 font-sans text-sm text-rpg-ink-faded">v0.1 — BETA</p>
      </div>

      {/* Campanha ativa */}
      {hasCampaign && (
        <div className="border-b-2 border-dashed border-rpg-border px-4 py-3">
          <p className="pixel-label text-rpg-ink-faded">Campanha ativa</p>
          <p className="mt-1 font-pixel text-pixel-sm leading-relaxed text-rpg-ink-dark">
            {selectedCampaign.nome}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-1 flex-row items-stretch gap-1 overflow-x-auto p-2 lg:flex-col lg:gap-2 lg:overflow-x-visible lg:overflow-y-auto lg:p-4">
        {NAV_ITEMS.map(item => {
          const isActive = activeModule === item.id;
          const isDisabled = item.requiresCampaign && !hasCampaign;

          return (
            <button
              key={item.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onNavigate(item.id)}
              title={isDisabled ? 'Selecione uma campanha primeiro' : item.description}
              className={[
                'group relative flex h-20 min-w-[120px] shrink-0 items-center justify-center rounded-none border-2 px-3 py-2 transition-all lg:h-[5.5rem] lg:w-full lg:px-4 lg:py-3',
                isActive
                  ? 'border-rpg-gold-dark bg-rpg-gold/15 shadow-pixel-gold'
                  : 'border-rpg-border bg-rpg-panel',
                isDisabled
                  ? 'cursor-not-allowed opacity-40'
                  : 'hover:border-rpg-gold hover:bg-rpg-gold/10',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl lg:left-4 lg:text-2xl">
                {item.emoji}
              </span>
              <div className="flex w-full flex-col items-center justify-center px-8 text-center lg:px-9">
                <span className="pixel-nav leading-relaxed">
                  {item.label}
                </span>
                <span className="hidden min-h-[2.5rem] w-full text-center font-sans text-sm leading-snug text-rpg-ink-faded lg:block">
                  {item.description}
                </span>
              </div>
              {isDisabled && (
                <Lock
                  size={12}
                  className="absolute right-2 top-2 text-rpg-border lg:right-3 lg:top-1/2 lg:-translate-y-1/2"
                />
              )}
              {isActive && (
                <span className="absolute -right-1 top-1/2 hidden h-0 w-0 -translate-y-1/2 border-y-8 border-l-8 border-y-transparent border-l-rpg-gold-dark lg:block" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer HUD */}
      <div className="hidden border-t-2 border-dashed border-rpg-border p-4 lg:block">
        <div className="flex items-center justify-between font-sans text-sm text-rpg-ink-dim">
          <span>🎲 MESTRE</span>
          <span className="animate-blink font-semibold text-rpg-forest">ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
