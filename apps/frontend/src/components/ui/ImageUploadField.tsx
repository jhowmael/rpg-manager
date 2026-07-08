import { useEffect, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { PixelButton } from './PixelButton';
import { ImageLightbox } from './ImageLightbox';
import { getEntityImageUrl } from '../../utils/entityImage';
import { validateImageFile } from '../../utils/imageUpload';

interface ImageUploadFieldProps {
  label?: string;
  imagemId?: string;
  fallbackEmoji?: string;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
  onClear?: () => void;
}

export function ImageUploadField({
  label = 'Retrato',
  imagemId,
  fallbackEmoji = '🖼️',
  disabled = false,
  onFileSelect,
  onClear,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const displayUrl = previewUrl ?? getEntityImageUrl(imagemId);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setPreviewUrl(current => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    onFileSelect(file);
  };

  const handleClear = () => {
    setPreviewUrl(current => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    onFileSelect(null);
    onClear?.();
    setError(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 border-2 border-rpg-border bg-rpg-panel p-5 shadow-pixel sm:flex-row sm:items-start">
      <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden border-2 border-rpg-border bg-rpg-parchment">
        {displayUrl ? (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="flex h-full w-full cursor-zoom-in items-center justify-center"
            title="Clique para ampliar"
          >
            <img
              src={displayUrl}
              alt="Pré-visualização"
              className="max-h-full max-w-full object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </button>
        ) : (
          <span className="text-4xl opacity-40">{fallbackEmoji}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
        <p className="pixel-label">{label}</p>
        <p className="font-sans text-xs text-rpg-ink-faded">
          JPG, PNG, GIF ou WebP — máximo 2 MB. A imagem é salva no servidor com ID único.
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <PixelButton
            type="button"
            variant="ghost"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            <span className="flex items-center gap-2">
              <ImagePlus size={14} />
              Carregar imagem
            </span>
          </PixelButton>
          {(previewUrl || imagemId) && (
            <PixelButton type="button" variant="ghost" disabled={disabled} onClick={handleClear}>
              Remover
            </PixelButton>
          )}
        </div>
        {error && <p className="font-sans text-xs text-rpg-hp">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {lightboxOpen && displayUrl && (
        <ImageLightbox
          src={displayUrl}
          alt="Pré-visualização"
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
