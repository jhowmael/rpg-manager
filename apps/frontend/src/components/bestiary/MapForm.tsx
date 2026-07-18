import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { PixelInput } from '../ui/PixelInput';
import { PixelTextarea } from '../ui/PixelTextarea';
import { ImageUploadField } from '../ui/ImageUploadField';
import type { CampaignMap, MapFormData } from '../../types/map';

interface MapFormProps {
  map?: CampaignMap;
  isSaving?: boolean;
  onSave: (data: MapFormData, imageFile?: File | null) => void;
  onCancel: () => void;
}

export function MapForm({ map, isSaving = false, onSave, onCancel }: MapFormProps) {
  const isEditing = Boolean(map);

  const [nome, setNome] = useState(map?.nome ?? '');
  const [descricao, setDescricao] = useState(map?.descricao ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [keepExistingImage, setKeepExistingImage] = useState(Boolean(map?.imagem_id));
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
        descricao: descricao.trim() || undefined,
        imagem_id: keepExistingImage ? map?.imagem_id : undefined,
      },
      imageFile,
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={onCancel}
        className="mb-6 flex items-center gap-2 font-sans text-sm text-rpg-ink-dim hover:text-rpg-ink-dark"
      >
        <ArrowLeft size={16} />
        Voltar para o grimório
      </button>

      <header className="mb-6 text-center">
        <p className="pixel-subtitle mb-2">🗺️ MAPA</p>
        <h1 className="pixel-title">{isEditing ? 'Editar Mapa' : 'Novo Mapa'}</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 border-2 border-rpg-border bg-rpg-panel p-6 shadow-pixel"
      >
        <ImageUploadField
          label="Imagem do mapa"
          imagemId={keepExistingImage ? map?.imagem_id : undefined}
          fallbackEmoji="🗺️"
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
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ex: Floresta de Eldenwood"
          disabled={isSaving}
          required
        />

        <PixelTextarea
          label="Descrição"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Breve descrição do local, pontos de interesse, atmosfera..."
          rows={5}
          disabled={isSaving}
        />

        {error && (
          <p className="font-sans text-sm text-rpg-hp">{error}</p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <PixelButton type="submit" variant="gold" disabled={isSaving}>
            <span className="flex items-center gap-2">
              <Save size={14} />
              {isSaving ? 'Salvando...' : 'Salvar mapa'}
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
