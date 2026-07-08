import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-rpg-void/95 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 border-2 border-rpg-border bg-rpg-panel p-2 text-rpg-ink-dim transition-colors hover:border-rpg-gold-dark hover:text-rpg-ink-dark"
        aria-label="Fechar visualização"
      >
        <X size={20} />
      </button>

      <figure
        className="flex max-h-full max-w-full items-center justify-center"
        onClick={event => event.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="block max-h-[min(90dvh,calc(100dvh-4rem))] max-w-[min(90vw,calc(100vw-4rem))] object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </figure>
    </div>,
    document.body,
  );
}
