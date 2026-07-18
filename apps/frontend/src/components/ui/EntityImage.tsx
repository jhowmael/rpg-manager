import { useState } from 'react';
import { getEntityImageUrl } from '../../utils/entityImage';
import { ImageLightbox } from './ImageLightbox';

interface EntityImageProps {
  imagemId?: string | null;
  alt: string;
  fallbackEmoji?: string;
  containerClassName?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  enableLightbox?: boolean;
  onImageClick?: (event: React.MouseEvent) => void;
}

export function EntityImage({
  imagemId,
  alt,
  fallbackEmoji = '🖼️',
  containerClassName = 'h-full w-full',
  imageClassName = '',
  fallbackClassName = 'text-5xl opacity-40',
  enableLightbox = true,
  onImageClick,
}: EntityImageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const url = getEntityImageUrl(imagemId);
  const canEnlarge = Boolean(url && (enableLightbox || onImageClick));

  const handleClick = (event: React.MouseEvent) => {
    if (onImageClick) {
      onImageClick(event);
      return;
    }

    if (enableLightbox && url) {
      event.stopPropagation();
      setLightboxOpen(true);
    }
  };

  return (
    <>
      <div
        className={[
          'flex items-center justify-center',
          containerClassName,
          canEnlarge ? 'cursor-zoom-in' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={url ? handleClick : undefined}
        onKeyDown={
          canEnlarge
            ? event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  if (onImageClick) {
                    onImageClick(event as unknown as React.MouseEvent);
                    return;
                  }
                  setLightboxOpen(true);
                }
              }
            : undefined
        }
        role={canEnlarge ? 'button' : undefined}
        tabIndex={canEnlarge ? 0 : undefined}
        title={canEnlarge ? 'Clique para ampliar' : undefined}
      >
        {url ? (
          <img
            src={url}
            alt={alt}
            className={['max-h-full max-w-full object-contain', imageClassName].filter(Boolean).join(' ')}
            style={{ width: 'auto', height: 'auto' }}
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${fallbackClassName}`}>
            {fallbackEmoji}
          </div>
        )}
      </div>

      {lightboxOpen && url && (
        <ImageLightbox src={url} alt={alt} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
