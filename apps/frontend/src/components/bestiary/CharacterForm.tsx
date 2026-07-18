import { useState } from 'react';
import { ArrowLeft, BookOpen, Save } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelInput } from '../ui/PixelInput';
import { PixelTextarea } from '../ui/PixelTextarea';
import { ImageUploadField } from '../ui/ImageUploadField';
import { PersonalityTagField } from '../ui/PersonalityTagField';
import { Open5eMonsterImportPicker } from '../ui/Open5eMonsterImportPicker';
import {
  CHARACTER_CLASSES,
  CHARACTER_RACES,
} from '../../data/characterOptions';
import {
  DEFAULT_ATTRIBUTES,
  type Character,
  type CharacterAbility,
  type CharacterAttributes,
  type CharacterFormData,
  type CharacterType,
} from '../../types/character';
import { normalizePersonality } from '../../utils/characterProfile';
import {
  fetchRemoteImageAsFile,
  type Open5eSheetImport,
} from '../../services/open5eService';
import { validateImageFile } from '../../utils/imageUpload';

interface CharacterFormProps {
  character?: Character;
  fixedTipo: CharacterType;
  isSaving?: boolean;
  onSave: (data: CharacterFormData, imageFile?: File | null) => void;
  onCancel: () => void;
}

const selectClass =
  'pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment px-3 py-2 font-sans text-base text-rpg-ink outline-none focus:border-rpg-gold disabled:opacity-60';

const attrInputClass =
  'pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment px-2 py-2 text-center font-sans text-base text-rpg-ink outline-none focus:border-rpg-gold disabled:opacity-60';

const ATTRIBUTE_FIELDS: { key: keyof CharacterAttributes; label: string }[] = [
  { key: 'forca', label: 'FOR' },
  { key: 'destreza', label: 'DES' },
  { key: 'constituicao', label: 'CON' },
  { key: 'inteligencia', label: 'INT' },
  { key: 'sabedoria', label: 'SAB' },
  { key: 'carisma', label: 'CAR' },
];

function splitListedOption(value: string | undefined, options: readonly string[]) {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return { select: '', custom: '' };
  if ((options as readonly string[]).includes(trimmed)) {
    return { select: trimmed, custom: '' };
  }
  return { select: 'Outro', custom: trimmed };
}

function resolveListedOption(select: string, custom: string): string | undefined {
  if (!select) return undefined;
  if (select === 'Outro') return custom.trim() || 'Outro';
  return select;
}

export function CharacterForm({
  character,
  fixedTipo,
  isSaving = false,
  onSave,
  onCancel,
}: CharacterFormProps) {
  const isEditing = Boolean(character);
  const tipo = character?.tipo ?? fixedTipo;

  const [nome, setNome] = useState(character?.nome ?? '');
  const [titulo, setTitulo] = useState(character?.titulo ?? '');
  const initialRaca = splitListedOption(character?.raca, CHARACTER_RACES);
  const initialClasse = splitListedOption(character?.classe, CHARACTER_CLASSES);
  const [raca, setRaca] = useState(initialRaca.select);
  const [racaCustom, setRacaCustom] = useState(initialRaca.custom);
  const [classe, setClasse] = useState(initialClasse.select);
  const [classeCustom, setClasseCustom] = useState(initialClasse.custom);
  const [vidaMaxima, setVidaMaxima] = useState(character?.vida_maxima ?? 20);
  const [ca, setCa] = useState(character?.ca ?? 10);
  const [atributos, setAtributos] = useState<CharacterAttributes>(
    character?.atributos ?? DEFAULT_ATTRIBUTES,
  );
  const [habilidades, setHabilidades] = useState<CharacterAbility[]>(
    character?.habilidades ?? [],
  );
  const [novaHabilidadeNome, setNovaHabilidadeNome] = useState('');
  const [novaHabilidadeDescricao, setNovaHabilidadeDescricao] = useState('');
  const [historia, setHistoria] = useState(character?.historia ?? '');
  const [caracteristicas, setCaracteristicas] = useState(character?.caracteristicas ?? '');
  const [oQueSabe, setOQueSabe] = useState(character?.o_que_sabe ?? '');
  const [personalidade, setPersonalidade] = useState<string[]>(
    normalizePersonality(character?.personalidade),
  );
  const [familiaRelacoes, setFamiliaRelacoes] = useState(character?.familia_relacoes ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState(Boolean(character?.imagem_id));
  const [open5eOpen, setOpen5eOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAtributo = (key: keyof CharacterAttributes, value: string) => {
    const parsed = Number.parseInt(value, 10);
    setAtributos(prev => ({
      ...prev,
      [key]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  const addHabilidade = () => {
    const nomeHabilidade = novaHabilidadeNome.trim();
    if (!nomeHabilidade) return;

    setHabilidades(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        nome: nomeHabilidade,
        descricao: novaHabilidadeDescricao.trim(),
      },
    ]);
    setNovaHabilidadeNome('');
    setNovaHabilidadeDescricao('');
  };

  const removeHabilidade = (id: string) => {
    setHabilidades(prev => prev.filter(h => h.id !== id));
  };

  const applyOpen5eSheet = async (sheet: Open5eSheetImport) => {
    setNome(sheet.nome);
    setTitulo(sheet.titulo ?? '');
    const race = splitListedOption(sheet.raca ?? 'Outro', CHARACTER_RACES);
    const klass = splitListedOption(sheet.classe ?? 'Outro', CHARACTER_CLASSES);
    setRaca(race.select || 'Outro');
    setRacaCustom(race.custom);
    setClasse(klass.select || 'Outro');
    setClasseCustom(klass.custom);
    setVidaMaxima(sheet.vida_maxima);
    setCa(sheet.ca);
    setAtributos(sheet.atributos);
    setHabilidades(sheet.habilidades);
    setHistoria(sheet.historia ?? '');
    setCaracteristicas(sheet.caracteristicas ?? '');
    setError(null);

    if (!sheet.imageUrl) return;

    try {
      const file = await fetchRemoteImageAsFile(sheet.imageUrl, sheet.nome);
      const validationError = validateImageFile(file);
      if (validationError) return;
      setImageFile(file);
      setKeepExistingImage(false);
    } catch {
      // Import da ficha segue mesmo se a imagem falhar.
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    onSave(
      {
        nome: nome.trim(),
        titulo: titulo.trim() || undefined,
        raca: resolveListedOption(raca, racaCustom),
        classe: resolveListedOption(classe, classeCustom),
        tipo,
        imagem_id: keepExistingImage ? character?.imagem_id : undefined,
        historia: historia.trim() || undefined,
        caracteristicas: caracteristicas.trim() || undefined,
        o_que_sabe: oQueSabe.trim() || undefined,
        personalidade,
        familia_relacoes: familiaRelacoes.trim() || undefined,
        vida_maxima: Math.max(1, vidaMaxima),
        ca: Math.max(0, ca),
        atributos,
        habilidades,
      },
      imageFile,
    );
  };

  const title = isEditing
    ? `Editar ${tipo === 'MOB' ? 'Mob' : 'NPC'}`
    : `Novo ${fixedTipo === 'MOB' ? 'Mob' : 'NPC'}`;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onCancel}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar para o grimório
      </button>

      <header className="mb-6 text-center">
        <p className="pixel-subtitle mb-2">{tipo === 'MOB' ? '💀 MOB / CRIATURA' : '👤 NPC'}</p>
        <h1 className="pixel-title">{title}</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-dashed border-rpg-mana/40 bg-rpg-mana/5 px-4 py-3">
          <p className="font-sans text-xs text-rpg-ink-dim">
            Importe um monstro do SRD (Open5e) para preencher a ficha automaticamente.
          </p>
          <PixelButton
            type="button"
            variant="ghost"
            disabled={isSaving}
            onClick={() => setOpen5eOpen(true)}
          >
            <span className="flex items-center gap-2">
              <BookOpen size={14} />
              Importar da Open5e
            </span>
          </PixelButton>
        </div>

        <ImageUploadField
          imagemId={keepExistingImage ? character?.imagem_id : undefined}
          fallbackEmoji={tipo === 'MOB' ? '💀' : '👤'}
          disabled={isSaving}
          enableOpen5eBrowse
          onFileSelect={file => {
            setImageFile(file);
            if (file) setKeepExistingImage(false);
          }}
          onClear={() => {
            setImageFile(null);
            setKeepExistingImage(false);
          }}
        />

        <PixelInput
          label="Nome"
          placeholder={tipo === 'MOB' ? 'Ex: Goblins da Mina Norte' : 'Ex: Thorn, o Ferreiro'}
          value={nome}
          onChange={e => setNome(e.target.value)}
          disabled={isSaving}
        />

        <PixelInput
          label="Título"
          placeholder={tipo === 'MOB' ? 'Ex: Capitão da tribo goblin' : 'Ex: Ferreiro da vila'}
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          disabled={isSaving}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="raca" className="pixel-label">
              Raça
            </label>
            <select
              id="raca"
              value={raca}
              onChange={e => {
                setRaca(e.target.value);
                if (e.target.value !== 'Outro') setRacaCustom('');
              }}
              disabled={isSaving}
              className={selectClass}
            >
              <option value="">Selecione…</option>
              {CHARACTER_RACES.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {raca === 'Outro' && (
              <input
                type="text"
                value={racaCustom}
                onChange={e => setRacaCustom(e.target.value)}
                disabled={isSaving}
                placeholder="Descreva a raça…"
                className="pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment px-3 py-2 font-sans text-base text-rpg-ink outline-none focus:border-rpg-gold disabled:opacity-60"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="classe" className="pixel-label">
              Classe
            </label>
            <select
              id="classe"
              value={classe}
              onChange={e => {
                setClasse(e.target.value);
                if (e.target.value !== 'Outro') setClasseCustom('');
              }}
              disabled={isSaving}
              className={selectClass}
            >
              <option value="">Selecione…</option>
              {CHARACTER_CLASSES.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {classe === 'Outro' && (
              <input
                type="text"
                value={classeCustom}
                onChange={e => setClasseCustom(e.target.value)}
                disabled={isSaving}
                placeholder="Descreva a classe…"
                className="pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment px-3 py-2 font-sans text-base text-rpg-ink outline-none focus:border-rpg-gold disabled:opacity-60"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="pixel-label">Tipo</span>
          <div
            className={[
              'inline-flex w-fit items-center gap-2 border-2 px-4 py-2 font-sans text-sm font-semibold',
              tipo === 'MOB'
                ? 'border-rpg-hp/50 bg-rpg-hp/10 text-rpg-hp'
                : 'border-rpg-forest/50 bg-rpg-forest/10 text-rpg-forest',
            ].join(' ')}
          >
            <span>{tipo === 'MOB' ? '💀' : '👤'}</span>
            {tipo}
            <span className="font-normal text-rpg-ink-faded">(fixo)</span>
          </div>
        </div>

        <section className="flex flex-col gap-3 border-2 border-rpg-border bg-rpg-parchment p-4">
          <h2 className="pixel-label">Combate</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="vida-maxima" className="pixel-label">
                Vida máx.
              </label>
              <input
                id="vida-maxima"
                type="number"
                min={1}
                value={vidaMaxima}
                onChange={e => setVidaMaxima(Math.max(1, Number(e.target.value) || 1))}
                disabled={isSaving}
                className={attrInputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="ca" className="pixel-label">
                CA
              </label>
              <input
                id="ca"
                type="number"
                min={0}
                value={ca}
                onChange={e => setCa(Math.max(0, Number(e.target.value) || 0))}
                disabled={isSaving}
                className={attrInputClass}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 border-2 border-rpg-border bg-rpg-parchment p-4">
          <h2 className="pixel-label">Atributos</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {ATTRIBUTE_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1">
                <label htmlFor={`attr-${key}`} className="pixel-label text-center">
                  {label}
                </label>
                <input
                  id={`attr-${key}`}
                  type="number"
                  min={0}
                  max={30}
                  value={atributos[key]}
                  onChange={e => updateAtributo(key, e.target.value)}
                  disabled={isSaving}
                  className={attrInputClass}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3 border-2 border-rpg-border bg-rpg-parchment p-4">
          <h2 className="pixel-label">Habilidades</h2>

          {habilidades.length > 0 && (
            <ul className="flex flex-col gap-2">
              {habilidades.map(habilidade => (
                <li
                  key={habilidade.id}
                  className="flex items-start justify-between gap-3 border-2 border-rpg-border bg-rpg-panel px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-semibold text-rpg-ink-dark">
                      {habilidade.nome}
                    </p>
                    {habilidade.descricao && (
                      <p className="mt-0.5 font-sans text-sm text-rpg-ink-dim">
                        {habilidade.descricao}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHabilidade(habilidade.id)}
                    disabled={isSaving}
                    className="shrink-0 font-sans text-xs font-semibold text-rpg-hp hover:underline disabled:opacity-60"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="habilidade-nome" className="pixel-label">
                Nome
              </label>
              <input
                id="habilidade-nome"
                type="text"
                placeholder="Ex: Visão no Escuro"
                value={novaHabilidadeNome}
                onChange={e => setNovaHabilidadeNome(e.target.value)}
                disabled={isSaving}
                className="pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment px-3 py-2 font-sans text-base text-rpg-ink outline-none focus:border-rpg-gold disabled:opacity-60"
              />
            </div>
            <div className="flex flex-[2] flex-col gap-2">
              <label htmlFor="habilidade-descricao" className="pixel-label">
                Descrição
              </label>
              <input
                id="habilidade-descricao"
                type="text"
                placeholder="O que essa habilidade faz..."
                value={novaHabilidadeDescricao}
                onChange={e => setNovaHabilidadeDescricao(e.target.value)}
                disabled={isSaving}
                className="pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment px-3 py-2 font-sans text-base text-rpg-ink outline-none focus:border-rpg-gold disabled:opacity-60"
              />
            </div>
            <PixelButton
              type="button"
              variant="ghost"
              onClick={addHabilidade}
              disabled={isSaving || !novaHabilidadeNome.trim()}
            >
              Adicionar
            </PixelButton>
          </div>
        </section>

        <PixelTextarea
          label="História"
          placeholder="Origem, papel na campanha, eventos marcantes..."
          value={historia}
          onChange={e => setHistoria(e.target.value)}
          disabled={isSaving}
        />

        <PixelTextarea
          label="Características"
          placeholder="Aparência, voz, manias, equipamento marcante..."
          value={caracteristicas}
          onChange={e => setCaracteristicas(e.target.value)}
          disabled={isSaving}
        />

        <PixelTextarea
          label="O que sabe"
          placeholder="Segredos, informações que pode revelar aos jogadores..."
          value={oQueSabe}
          onChange={e => setOQueSabe(e.target.value)}
          disabled={isSaving}
        />

        <PersonalityTagField
          value={personalidade}
          onChange={setPersonalidade}
          disabled={isSaving}
        />

        <PixelTextarea
          label="Família & Relações"
          placeholder="Parentes, aliados, inimigos, vínculos..."
          value={familiaRelacoes}
          onChange={e => setFamiliaRelacoes(e.target.value)}
          disabled={isSaving}
        />

        {error && <p className="font-sans text-sm text-rpg-hp">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <PixelButton type="submit" variant="gold" disabled={isSaving}>
            <span className="flex items-center gap-2">
              <Save size={14} />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </span>
          </PixelButton>
          <PixelButton type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </PixelButton>
        </div>
      </form>

      <Open5eMonsterImportPicker
        open={open5eOpen}
        onClose={() => setOpen5eOpen(false)}
        onImport={sheet => void applyOpen5eSheet(sheet)}
      />
    </div>
  );
}
