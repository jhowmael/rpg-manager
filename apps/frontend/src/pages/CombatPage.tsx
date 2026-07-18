import { useCallback, useEffect, useRef, useState } from 'react';
import { CombatBattle } from '../components/combat/CombatBattle';
import { CombatHistory } from '../components/combat/CombatHistory';
import { CombatInitiative } from '../components/combat/CombatInitiative';
import { CombatList } from '../components/combat/CombatList';
import { CombatSetup } from '../components/combat/CombatSetup';
import { ApiError } from '../services/api';
import { createBestiaryEntry } from '../services/bestiaryService';
import { createCombat, deleteCombat, updateCombat } from '../services/combatService';
import type { Character } from '../types/character';
import type { Hero } from '../types/hero';
import type { Combat, CombatFighter, NewFighterData } from '../types/combat';
import { updateFighter } from '../utils/combat';

type View = 'list' | 'setup' | 'initiative' | 'battle' | 'history';

interface CombatPageProps {
	campaignId: string;
	campaignName: string;
	characters: Character[];
	heroes: Hero[];
	combats: Combat[];
	onCombatsChange: (combats: Combat[]) => void;
	onCharactersChange?: (characters: Character[]) => void;
}

function createEmptyCombat(campaignId: string): Combat {
	return {
		id: crypto.randomUUID(),
		campanha_id: campaignId,
		nome: 'Novo combate',
		tempo_turno_minutos: 3,
		fase: 'setup',
		rodada_atual: 1,
		turno_atual_index: 0,
		turno_iniciado_em: null,
		fighters: [],
		criado_em: new Date().toISOString(),
	};
}

function createFighter(data: NewFighterData): CombatFighter {
	return {
		id: crypto.randomUUID(),
		nome: data.nome,
		source: data.source,
		sourceId: data.sourceId,
		imagem: data.imagem,
		vidaMaxima: data.vidaMaxima,
		vidaAtual: data.vidaAtual,
		ca: data.ca,
		iniciativa: null,
		ordemVez: 0,
		buffs: [],
		debuffs: [],
		status: 'active',
		atributos: data.atributos,
		habilidades: data.habilidades,
	};
}

export function CombatPage({
	campaignId,
	campaignName,
	characters,
	heroes,
	combats,
	onCombatsChange,
	onCharactersChange,
}: CombatPageProps) {
	const [view, setView] = useState<View>('list');
	const [activeCombatId, setActiveCombatId] = useState<string | null>(null);
	const [toast, setToast] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const campaignCombats = combats.filter(c => c.campanha_id === campaignId);
	const campaignCharacters = characters.filter(c => c.campanha_id === campaignId);
	const campaignHeroes = heroes.filter(h => h.campanha_id === campaignId);
	const activeCombat = activeCombatId
		? combats.find(c => c.id === activeCombatId)
		: null;

	const showToast = (message: string) => {
		setToast(message);
		setTimeout(() => setToast(null), 3000);
	};

	const replaceCombat = useCallback((updated: Combat) => {
		onCombatsChange(combats.map(c => (c.id === updated.id ? updated : c)));
	}, [combats, onCombatsChange]);

	const persistCombat = useCallback(async (combat: Combat, immediate = false) => {
		const run = async () => {
			try {
				setIsSaving(true);
				const saved = await updateCombat(combat.id, combat);
				replaceCombat(saved);
			} catch (error) {
				const message =
					error instanceof ApiError
						? error.message
						: 'Não foi possível salvar o combate.';
				showToast(`⚠️ ${message}`);
			} finally {
				setIsSaving(false);
			}
		};

		if (immediate) {
			if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
			await run();
			return;
		}

		if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
		saveTimerRef.current = setTimeout(() => {
			void run();
		}, 500);
	}, [replaceCombat]);

	useEffect(() => {
		return () => {
			if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
		};
	}, []);

	const updateCombatState = (id: string, patch: Partial<Combat> | Combat, immediate = false) => {
		const current = combats.find(c => c.id === id);
		if (!current) return;

		const next = { ...current, ...patch };
		onCombatsChange(combats.map(c => (c.id === id ? next : c)));
		void persistCombat(next, immediate);
	};

	const goToList = () => {
		setActiveCombatId(null);
		setView('list');
	};

	const openCombat = (combat: Combat) => {
		setActiveCombatId(combat.id);
		if (combat.fase === 'finished') setView('history');
		else if (combat.fase === 'setup') setView('setup');
		else if (combat.fase === 'initiative') setView('initiative');
		else setView('battle');
	};

	const handleCreate = async () => {
		const draft = createEmptyCombat(campaignId);

		try {
			setIsSaving(true);
			const created = await createCombat(draft);
			onCombatsChange([created, ...combats]);
			setActiveCombatId(created.id);
			setView('setup');
			showToast('⚔️ Novo combate criado!');
		} catch (error) {
			const message =
				error instanceof ApiError
					? error.message
					: 'Não foi possível criar o combate.';
			showToast(`⚠️ ${message}`);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Excluir este combate?')) return;

		try {
			await deleteCombat(id);
			onCombatsChange(combats.filter(c => c.id !== id));
			if (activeCombatId === id) goToList();
			showToast('Combate removido.');
		} catch (error) {
			const message =
				error instanceof ApiError
					? error.message
					: 'Não foi possível excluir o combate.';
			showToast(`⚠️ ${message}`);
		}
	};

	if (!activeCombat) {
		return (
			<>
				<p className="mb-4 text-center font-sans text-sm text-rpg-ink-faded">
					Campanha: <span className="font-semibold text-rpg-ink-dark">{campaignName}</span>
				</p>
				<CombatList
					combats={campaignCombats}
					onCreate={() => void handleCreate()}
					onOpen={openCombat}
					onDelete={id => void handleDelete(id)}
				/>
				{toast && <Toast message={toast} />}
				{isSaving && <SavingIndicator />}
			</>
		);
	}

	const banner = (
		<p className="mb-4 text-center font-sans text-sm text-rpg-ink-faded">
			Campanha: <span className="font-semibold text-rpg-ink-dark">{campaignName}</span>
			{isSaving && <span className="ml-2 text-rpg-gold-dark">· salvando…</span>}
		</p>
	);

	if (view === 'setup') {
		return (
			<>
				{banner}
				<CombatSetup
					combat={activeCombat}
					heroes={campaignHeroes}
					characters={campaignCharacters}
					campaignId={campaignId}
					onUpdate={patch => updateCombatState(activeCombat.id, patch)}
					onAddFighter={async data => {
						let fighterData = data;
						if (data.registerInBestiary) {
							const created = await createBestiaryEntry({
								campanha_id: campaignId,
								nome: data.nome,
								tipo: data.bestiaryTipo ?? 'NPC',
								atributos: data.atributos,
								habilidades: data.habilidades,
							});
							onCharactersChange?.([...characters, created]);
							fighterData = {
								...data,
								source: created.tipo === 'MOB' ? 'MOB' : 'NPC',
								sourceId: created.id,
								registerInBestiary: undefined,
							};
						}
						updateCombatState(activeCombat.id, {
							fighters: [...activeCombat.fighters, createFighter(fighterData)],
						});
					}}
					onRemoveFighter={fighterId => {
						updateCombatState(activeCombat.id, {
							fighters: activeCombat.fighters.filter(f => f.id !== fighterId),
						});
					}}
					onNext={() => {
						updateCombatState(activeCombat.id, { fase: 'initiative' }, true);
						setView('initiative');
					}}
					onBack={goToList}
				/>
				{toast && <Toast message={toast} />}
			</>
		);
	}

	if (view === 'initiative') {
		return (
			<>
				{banner}
				<CombatInitiative
					combat={activeCombat}
					onUpdateFighter={(fighterId, patch) => {
						updateCombatState(
							activeCombat.id,
							updateFighter(activeCombat, fighterId, patch),
						);
					}}
					onStartBattle={sortedFighters => {
						updateCombatState(activeCombat.id, {
							fase: 'battle',
							fighters: sortedFighters,
							rodada_atual: 1,
							turno_atual_index: 0,
							turno_iniciado_em: Date.now(),
						}, true);
						setView('battle');
						showToast('⚔️ Batalha iniciada!');
					}}
					onBack={() => {
						updateCombatState(activeCombat.id, { fase: 'setup' }, true);
						setView('setup');
					}}
				/>
				{toast && <Toast message={toast} />}
			</>
		);
	}

	if (view === 'history' && activeCombat) {
		return (
			<>
				{banner}
				<CombatHistory combat={activeCombat} onBack={goToList} />
				{toast && <Toast message={toast} />}
			</>
		);
	}

	return (
		<>
			{banner}
			<CombatBattle
				combat={activeCombat}
				onUpdate={combat => updateCombatState(activeCombat.id, combat)}
				onBack={goToList}
				onEnd={() => {
					if (window.confirm('Encerrar este combate?')) {
						updateCombatState(activeCombat.id, {
							fase: 'finished',
							turno_iniciado_em: null,
							encerrado_em: new Date().toISOString(),
						}, true);
						showToast('Combate encerrado.');
						setView('history');
					}
				}}
				onViewHistory={() => setView('history')}
			/>
			{toast && <Toast message={toast} />}
		</>
	);
}

function Toast({ message }: { message: string }) {
	return (
		<div className="fixed bottom-6 left-6 z-50 border-2 border-rpg-border-dark bg-rpg-panel px-5 py-3 font-sans text-base text-rpg-ink-dark shadow-pixel-dark">
			{message}
		</div>
	);
}

function SavingIndicator() {
	return (
		<div className="fixed bottom-6 right-6 z-50 border-2 border-rpg-border-dark bg-rpg-panel px-4 py-2 font-sans text-sm text-rpg-ink-dim shadow-pixel-dark">
			Salvando…
		</div>
	);
}
