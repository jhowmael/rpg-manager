import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelInput } from '../ui/PixelInput';
import { PixelTextarea } from '../ui/PixelTextarea';
import { ImageUploadField } from '../ui/ImageUploadField';
import { HERO_CLASSES, HERO_RACES } from '../../data/heroOptions';
import type { Hero, HeroFormData } from '../../types/hero';

interface HeroFormProps {
  hero?: Hero;
  isSaving?: boolean;
  onSave: (data: HeroFormData, imageFile?: File | null) => void;
  onCancel: () => void;
}

const selectClass =
  'pixel-corners w-full border-2 border-rpg-border bg-rpg-parchment px-3 py-2 font-sans text-base text-rpg-ink outline-none focus:border-rpg-gold disabled:opacity-60';

export function HeroForm({ hero, isSaving = false, onSave, onCancel }: HeroFormProps) {
  const isEditing = Boolean(hero);

  const [nome, setNome] = useState(hero?.nome ?? '');
  const [raca, setRaca] = useState(hero?.raca ?? HERO_RACES[0]);
  const [classe, setClasse] = useState(hero?.classe ?? HERO_CLASSES[0]);
  const [historia, setHistoria] = useState(hero?.historia ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState(Boolean(hero?.imagem_id));
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
        raca,
        classe,
        historia: historia.trim() || undefined,
        imagem_id: keepExistingImage ? hero?.imagem_id : undefined,
      },
      imageFile,
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onCancel}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar para heróis
      </button>

      <header className="mb-6 text-center">
        <p className="pixel-subtitle mb-2">🛡️ JOGADOR</p>
        <h1 className="pixel-title">{isEditing ? 'Editar Herói' : 'Novo Herói'}</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <ImageUploadField
          imagemId={keepExistingImage ? hero?.imagem_id : undefined}
          fallbackEmoji="🛡️"
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
          placeholder="Ex: Kaelen Voss"
          value={nome}
          onChange={e => setNome(e.target.value)}
          disabled={isSaving}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="raca" className="pixel-label">
            Raça
          </label>
          <select
            id="raca"
            value={raca}
            onChange={e => setRaca(e.target.value as typeof raca)}
            className={selectClass}
            disabled={isSaving}
          >
            {HERO_RACES.map(option => (
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
            onChange={e => setClasse(e.target.value as typeof classe)}
            className={selectClass}
            disabled={isSaving}
          >
            {HERO_CLASSES.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <PixelTextarea
          label="História"
          placeholder="Background do personagem, motivações, ligação com a campanha..."
          value={historia}
          onChange={e => setHistoria(e.target.value)}
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
