import { useState } from 'react';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelInput } from '../ui/PixelInput';
import type { Character } from '../../types/character';
import { DEFAULT_ATTRIBUTES, getCharacterEmoji } from '../../types/character';
import type { Hero } from '../../types/hero';
import type { CombatFighter, FighterSource, NewFighterData } from '../../types/combat';
import { getEntityImageUrl } from '../../utils/entityImage';

type AddMode = 'hero' | 'npc' | 'mob' | 'custom';
type CustomTipo = 'NPC' | 'MOB';

interface AddFighterFormProps {
	heroes: Hero[];
	characters: Character[];
	campaignId: string;
	onAdd: (data: NewFighterData) => void | Promise<void>;
	onBestiaryCreated?: (character: Character) => void;
}

const selectClass =
	'pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment px-3 py-2 font-sans text-sm text-rpg-ink outline-none focus:border-rpg-gold';

export function AddFighterForm({ heroes, characters, onAdd }: AddFighterFormProps) {
	const [mode, setMode] = useState<AddMode>('hero');
	const [sourceId, setSourceId] = useState('');
	const [nome, setNome] = useState('');
	const [customTipo, setCustomTipo] = useState<CustomTipo>('NPC');
	const [vidaMaxima, setVidaMaxima] = useState(20);
	const [vidaAtual, setVidaAtual] = useState(20);
	const [ca, setCa] = useState(10);

	const npcs = characters.filter(c => c.tipo === 'NPC');
	const mobs = characters.filter(c => c.tipo === 'MOB');

	const resetForm = () => {
		setSourceId('');
		setNome('');
		setCustomTipo('NPC');
		setVidaMaxima(20);
		setVidaAtual(20);
		setCa(10);
	};

	const applyCharacterStats = (characterId: string, list: Character[]) => {
		const character = list.find(c => c.id === characterId);
		if (!character) return;
		if (character.vida_maxima != null) {
			setVidaMaxima(character.vida_maxima);
			setVidaAtual(character.vida_maxima);
		}
		if (character.ca != null) {
			setCa(character.ca);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		let data: NewFighterData;

		if (mode === 'hero') {
			const hero = heroes.find(h => h.id === sourceId);
			if (!hero) return;
			data = {
				nome: hero.nome,
				source: 'HERO',
				sourceId: hero.id,
				imagem: getEntityImageUrl(hero.imagem_id),
				vidaMaxima,
				vidaAtual,
				ca,
			};
		} else if (mode === 'npc' || mode === 'mob') {
			const list = mode === 'npc' ? npcs : mobs;
			const character = list.find(c => c.id === sourceId);
			if (!character) return;
			const maxHp = character.vida_maxima ?? vidaMaxima;
			const armor = character.ca ?? ca;
			data = {
				nome: character.nome,
				source: mode === 'npc' ? 'NPC' : 'MOB',
				sourceId: character.id,
				imagem: getEntityImageUrl(character.imagem_id),
				vidaMaxima: maxHp,
				vidaAtual: maxHp,
				ca: armor,
				atributos: character.atributos,
				habilidades: character.habilidades,
			};
		} else {
			if (!nome.trim()) return;
			data = {
				nome: nome.trim(),
				source: customTipo === 'MOB' ? 'MOB' : 'NPC',
				vidaMaxima,
				vidaAtual,
				ca,
				atributos: DEFAULT_ATTRIBUTES,
				habilidades: [],
				registerInBestiary: true,
				bestiaryTipo: customTipo,
			};
		}

		await onAdd(data);
		resetForm();
	};

	return (
		<form
			onSubmit={e => void handleSubmit(e)}
			className="flex flex-col gap-4 border-2 border-dashed border-rpg-border bg-rpg-parchment/50 p-4"
		>
			<p className="pixel-label flex items-center gap-2">
				<UserPlus size={14} />
				Adicionar combatente
			</p>

			<div className="flex flex-wrap gap-2">
				<ModeChip active={mode === 'hero'} label="Herói" onClick={() => { setMode('hero'); setSourceId(''); }} />
				<ModeChip active={mode === 'npc'} label="NPC" onClick={() => { setMode('npc'); setSourceId(''); }} />
				<ModeChip active={mode === 'mob'} label="Mob" onClick={() => { setMode('mob'); setSourceId(''); }} />
				<ModeChip active={mode === 'custom'} label="Na hora" onClick={() => setMode('custom')} />
			</div>

			{mode === 'hero' && (
				<select value={sourceId} onChange={e => setSourceId(e.target.value)} className={selectClass} required>
					<option value="">Selecione um herói…</option>
					{heroes.map(h => (
						<option key={h.id} value={h.id}>{h.nome} — {h.classe}</option>
					))}
				</select>
			)}

			{mode === 'npc' && (
				<select
					value={sourceId}
					onChange={e => {
						const id = e.target.value;
						setSourceId(id);
						applyCharacterStats(id, npcs);
					}}
					className={selectClass}
					required
				>
					<option value="">Selecione um NPC…</option>
					{npcs.map(c => (
						<option key={c.id} value={c.id}>{c.nome}</option>
					))}
				</select>
			)}

			{mode === 'mob' && (
				<select
					value={sourceId}
					onChange={e => {
						const id = e.target.value;
						setSourceId(id);
						applyCharacterStats(id, mobs);
					}}
					className={selectClass}
					required
				>
					<option value="">Selecione um mob…</option>
					{mobs.map(c => (
						<option key={c.id} value={c.id}>{c.nome}</option>
					))}
				</select>
			)}

			{mode === 'custom' && (
				<>
					<div className="flex flex-wrap gap-2">
						<ModeChip active={customTipo === 'NPC'} label="NPC" onClick={() => setCustomTipo('NPC')} />
						<ModeChip active={customTipo === 'MOB'} label="Mob" onClick={() => setCustomTipo('MOB')} />
					</div>
					<PixelInput
						label="Nome"
						placeholder="Ex: Guarda da Porta"
						value={nome}
						onChange={e => setNome(e.target.value)}
					/>
				</>
			)}

			<div className="grid gap-3 sm:grid-cols-3">
				<NumberField label="Vida máx." value={vidaMaxima} onChange={setVidaMaxima} />
				<NumberField
					label="Vida atual"
					value={vidaAtual}
					onChange={setVidaAtual}
				/>
				<NumberField label="CA" value={ca} onChange={setCa} />
			</div>

			<PixelButton type="submit" variant="forest">
				<span className="flex items-center gap-2">
					<Plus size={14} />
					Adicionar à lista
				</span>
			</PixelButton>
		</form>
	);
}

function ModeChip({
	active,
	label,
	onClick,
}: {
	active: boolean;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={[
				'border-2 px-3 py-1 font-sans text-xs font-semibold transition-colors',
				active
					? 'border-rpg-gold-dark bg-rpg-gold/15 text-rpg-ink-dark'
					: 'border-rpg-border bg-rpg-panel text-rpg-ink-dim hover:border-rpg-gold-dark',
			].join(' ')}
		>
			{label}
		</button>
	);
}

function NumberField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: number;
	onChange: (v: number) => void;
}) {
	return (
		<div className="flex flex-col gap-1">
			<label className="font-sans text-xs font-bold text-rpg-ink-dim">{label}</label>
			<input
				type="number"
				min={0}
				value={value}
				onChange={e => onChange(Number(e.target.value))}
				className={selectClass}
			/>
		</div>
	);
}

export function FighterSetupRow({
	fighter,
	onRemove,
}: {
	fighter: CombatFighter;
	onRemove: () => void;
}) {
	const emoji =
		fighter.source === 'HERO' ? '🛡️' : fighter.source === 'MOB' ? '💀' : fighter.source === 'NPC' ? '👤' : '⚔️';

	return (
		<div className="flex items-center gap-3 border-2 border-rpg-border bg-rpg-parchment p-3">
			<div className="h-12 w-12 shrink-0 overflow-hidden border border-rpg-border bg-rpg-panel">
				{fighter.imagem ? (
					<img src={fighter.imagem} alt="" className="h-full w-full object-cover" />
				) : (
					<div className="flex h-full items-center justify-center text-xl">{emoji}</div>
				)}
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate font-sans text-sm font-bold text-rpg-ink-dark">{fighter.nome}</p>
				<p className="font-sans text-xs text-rpg-ink-faded">
					HP {fighter.vidaAtual}/{fighter.vidaMaxima} · CA {fighter.ca} · {fighter.source}
				</p>
			</div>
			<button
				type="button"
				onClick={onRemove}
				className="border-2 border-rpg-border p-2 text-rpg-hp hover:border-rpg-hp hover:bg-rpg-hp/10"
			>
				<Trash2 size={14} />
			</button>
		</div>
	);
}

export function sourceLabel(source: FighterSource): string {
	const map: Record<FighterSource, string> = {
		HERO: 'Herói',
		NPC: 'NPC',
		MOB: 'Mob',
		CUSTOM: 'Avulso',
	};
	return map[source];
}

export function fighterEmoji(fighter: CombatFighter): string {
	if (fighter.source === 'MOB') return '💀';
	if (fighter.source === 'HERO') return '🛡️';
	if (fighter.source === 'NPC') return '👤';
	return getCharacterEmoji('NPC');
}
