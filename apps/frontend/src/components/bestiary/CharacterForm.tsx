import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelInput } from '../ui/PixelInput';
import { PixelTextarea } from '../ui/PixelTextarea';
import { ImageUploadField } from '../ui/ImageUploadField';
import type { Character, CharacterFormData, CharacterType } from '../../types/character';

interface CharacterFormProps {
  character?: Character;
  fixedTipo: CharacterType;
  isSaving?: boolean;
  onSave: (data: CharacterFormData, imageFile?: File | null) => void;
  onCancel: () => void;
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
  const [historia, setHistoria] = useState(character?.historia ?? '');
  const [oQueSabe, setOQueSabe] = useState(character?.o_que_sabe ?? '');
  const [personalidade, setPersonalidade] = useState(character?.personalidade ?? '');
  const [familiaRelacoes, setFamiliaRelacoes] = useState(character?.familia_relacoes ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState(Boolean(character?.imagem_id));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    onSave(
      {
        nome: nome.trim(),
        tipo,
        imagem_id: keepExistingImage ? character?.imagem_id : undefined,
        historia: historia.trim() || undefined,
        o_que_sabe: oQueSabe.trim() || undefined,
        personalidade: personalidade.trim() || undefined,
        familia_relacoes: familiaRelacoes.trim() || undefined,
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

        <PixelTextarea
          label="História"
          placeholder="Origem, papel na campanha, eventos marcantes..."
          value={historia}
          onChange={e => setHistoria(e.target.value)}
          disabled={isSaving}
        />

        <PixelTextarea
          label="O que sabe"
          placeholder="Segredos, informações que pode revelar aos jogadores..."
          value={oQueSabe}
          onChange={e => setOQueSabe(e.target.value)}
          disabled={isSaving}
        />

        <PixelTextarea
          label="Personalidade"
          placeholder="Tom de voz, traços, motivações..."
          value={personalidade}
          onChange={e => setPersonalidade(e.target.value)}
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
