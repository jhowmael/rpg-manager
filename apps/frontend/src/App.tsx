import { useCallback, useEffect, useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import type { NavModuleId } from './data/navigation';
import { BestiaryPage } from './pages/BestiaryPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CombatPage } from './pages/CombatPage';
import { HeroesPage } from './pages/HeroesPage';
import { HistoryPage } from './pages/HistoryPage';
import {
  createCampaign,
  deleteCampaign,
  fetchCampaigns,
  updateCampaign,
} from './services/campaignService';
import { fetchBestiary } from './services/bestiaryService';
import { fetchCombats } from './services/combatService';
import { fetchHeroes } from './services/heroService';
import type { Campaign, CreateCampaignInput, UpdateCampaignInput } from './types/campaign';
import type { Character } from './types/character';
import type { Hero } from './types/hero';
import type { Combat } from './types/combat';
import { ApiError } from './services/api';

export default function App() {
  const [activeModule, setActiveModule] = useState<NavModuleId>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [combats, setCombats] = useState<Combat[]>([]);

  const loadCampaigns = useCallback(async () => {
    try {
      setIsLoadingCampaigns(true);
      setCampaignsError(null);
      const data = await fetchCampaigns();
      setCampaigns(data);
      setSelectedCampaign(current => {
        if (!current) return current;
        return data.find(campaign => campaign.id === current.id) ?? null;
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Não foi possível carregar as campanhas.';
      setCampaignsError(message);
    } finally {
      setIsLoadingCampaigns(false);
    }
  }, []);

  const loadCampaignData = useCallback(async (campaignId: string) => {
    try {
      const [bestiary, campaignHeroes, campaignCombats] = await Promise.all([
        fetchBestiary(campaignId),
        fetchHeroes(campaignId),
        fetchCombats(campaignId),
      ]);
      setCharacters(bestiary);
      setHeroes(campaignHeroes);
      setCombats(campaignCombats);
    } catch {
      setCharacters([]);
      setHeroes([]);
      setCombats([]);
    }
  }, []);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    if (selectedCampaign) {
      void loadCampaignData(selectedCampaign.id);
    } else {
      setCharacters([]);
      setHeroes([]);
      setCombats([]);
    }
  }, [selectedCampaign, loadCampaignData]);

  useEffect(() => {
    if (
      selectedCampaign &&
      (activeModule === 'history' || activeModule === 'combat')
    ) {
      void loadCampaignData(selectedCampaign.id);
    }
  }, [activeModule, selectedCampaign, loadCampaignData]);

  const handleCreateCampaign = async (input: CreateCampaignInput) => {
    const campaign = await createCampaign(input);
    setCampaigns(prev => [campaign, ...prev]);
    return campaign;
  };

  const handleUpdateCampaign = async (id: string, input: UpdateCampaignInput) => {
    const campaign = await updateCampaign(id, input);
    setCampaigns(prev => prev.map(item => (item.id === id ? campaign : item)));
    setSelectedCampaign(current => (current?.id === id ? campaign : current));
    return campaign;
  };

  const handleDeleteCampaign = async (id: string) => {
    await deleteCampaign(id);
    setCampaigns(prev => prev.filter(item => item.id !== id));
    setSelectedCampaign(current => (current?.id === id ? null : current));
    setCharacters([]);
    setHeroes([]);
    setCombats([]);
    if (activeModule !== 'campaigns') {
      setActiveModule('campaigns');
    }
  };

  const renderPage = () => {
    switch (activeModule) {
      case 'campaigns':
        return (
          <CampaignsPage
            campaigns={campaigns}
            selectedCampaign={selectedCampaign}
            isLoading={isLoadingCampaigns}
            error={campaignsError}
            onSelectCampaign={setSelectedCampaign}
            onCreateCampaign={handleCreateCampaign}
            onUpdateCampaign={handleUpdateCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            onRetry={loadCampaigns}
          />
        );
      case 'history':
        return (
          <HistoryPage
            campaignId={selectedCampaign!.id}
            campaignName={selectedCampaign!.nome}
            characters={characters}
          />
        );
      case 'bestiary':
        return (
          <BestiaryPage
            campaignId={selectedCampaign!.id}
            campaignName={selectedCampaign!.nome}
            onCharactersChange={setCharacters}
          />
        );
      case 'heroes':
        return (
          <HeroesPage
            campaignId={selectedCampaign!.id}
            campaignName={selectedCampaign!.nome}
            onHeroesChange={setHeroes}
          />
        );
      case 'combat':
        return (
          <CombatPage
            campaignId={selectedCampaign!.id}
            campaignName={selectedCampaign!.nome}
            characters={characters}
            heroes={heroes}
            combats={combats}
            onCombatsChange={setCombats}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout
      activeModule={activeModule}
      selectedCampaign={selectedCampaign}
      onNavigate={setActiveModule}
    >
      {renderPage()}
    </AppLayout>
  );
}
