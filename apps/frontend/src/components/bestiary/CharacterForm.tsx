import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelInput } from '../ui/PixelInput';
import { PixelTextarea } from '../ui/PixelTextarea';
import { ImageUploadField } from '../ui/ImageUploadField';
import { PersonalityTagField } from '../ui/PersonalityTagField';
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
  const [raca, setRaca] = useState(character?.raca ?? '');
  const [classe, setClasse] = useState(character?.classe ?? '');
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
        raca: raca || undefined,
        classe: classe || undefined,
        tipo,
        imagem_id: keepExistingImage ? character?.imagem_id : undefined,
        historia: historia.trim() || undefined,
        caracteristicas: caracteristicas.trim() || undefined,
        o_que_sabe: oQueSabe.trim() || undefined,
        personalidade,
        familia_relacoes: familiaRelacoes.trim() || undefined,
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
        <ImageUploadField
          imagemId={keepExistingImage ? character?.imagem_id : undefined}
          fallbackEmoji={tipo === 'MOB' ? '💀' : '👤'}
          disabled={isSaving}
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
              onChange={e => setRaca(e.target.value)}
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
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="classe" className="pixel-label">
              Classe
            </label>
            <select
              id="classe"
              value={classe}
              onChange={e => setClasse(e.target.value)}
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
    </div>
  );
}
