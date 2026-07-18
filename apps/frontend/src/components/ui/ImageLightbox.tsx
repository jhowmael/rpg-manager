import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minus, Plus, RotateCcw, X } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const ZOOM_STEP = 0.5;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const skipClickZoomRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const applyZoom = useCallback((nextZoom: number, focusX?: number, focusY?: number) => {
    const currentZoom = zoomRef.current;
    const clamped = clampZoom(nextZoom);
    if (clamped === currentZoom) return;

    if (clamped === MIN_ZOOM) {
      setZoom(clamped);
      setOffset({ x: 0, y: 0 });
      return;
    }

    const viewport = viewportRef.current;
    if (viewport && focusX !== undefined && focusY !== undefined) {
      const rect = viewport.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const pointX = focusX - rect.left - centerX;
      const pointY = focusY - rect.top - centerY;
      const ratio = clamped / currentZoom;

      setOffset(current => ({
        x: pointX - (pointX - current.x) * ratio,
        y: pointY - (pointY - current.y) * ratio,
      }));
    }

    setZoom(clamped);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        applyZoom(zoomRef.current + ZOOM_STEP);
      }
      if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        applyZoom(zoomRef.current - ZOOM_STEP);
      }
      if (event.key === '0') {
        event.preventDefault();
        resetView();
      }
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [applyZoom, onClose, resetView]);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    applyZoom(zoomRef.current + direction, event.clientX, event.clientY);
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
      moved: false,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      drag.moved = true;
    }

    if (zoomRef.current > MIN_ZOOM) {
      setOffset({
        x: drag.originX + dx,
        y: drag.originY + dy,
      });
    }
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.moved) {
      skipClickZoomRef.current = true;
    }

    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleImageClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (skipClickZoomRef.current) {
      skipClickZoomRef.current = false;
      return;
    }

    if (zoomRef.current >= MAX_ZOOM) {
      resetView();
      return;
    }

    applyZoom(zoomRef.current + ZOOM_STEP, event.clientX, event.clientY);
  };

  const zoomPercent = Math.round(zoom * 100);
  const canZoomIn = zoom < MAX_ZOOM;
  const canZoomOut = zoom > MIN_ZOOM;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-rpg-void/95"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-rpg-border bg-rpg-panel/95 px-3 py-2 sm:px-4">
        <p className="min-w-0 truncate font-sans text-sm text-rpg-ink-dim">{alt}</p>

        <div className="flex items-center gap-1 sm:gap-2">
          <ControlButton
            label="Diminuir zoom"
            onClick={() => applyZoom(zoom - ZOOM_STEP)}
            disabled={!canZoomOut}
          >
            <Minus size={18} />
          </ControlButton>
          <span className="min-w-[3.5rem] text-center font-sans text-xs font-semibold tabular-nums text-rpg-ink-dark">
            {zoomPercent}%
          </span>
          <ControlButton
            label="Aumentar zoom"
            onClick={() => applyZoom(zoom + ZOOM_STEP)}
            disabled={!canZoomIn}
          >
            <Plus size={18} />
          </ControlButton>
          <ControlButton label="Resetar zoom" onClick={resetView} disabled={zoom === MIN_ZOOM}>
            <RotateCcw size={16} />
          </ControlButton>
          <ControlButton label="Fechar visualização" onClick={onClose}>
            <X size={18} />
          </ControlButton>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="relative min-h-0 flex-1 touch-none overflow-hidden"
        onClick={onClose}
        onWheel={handleWheel}
      >
        <div
          className="flex h-full w-full items-center justify-center p-4 sm:p-6"
          onClick={event => event.stopPropagation()}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            onClick={handleImageClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={[
              'block max-h-full max-w-full select-none object-contain',
              zoom > MIN_ZOOM
                ? dragging
                  ? 'cursor-grabbing'
                  : 'cursor-grab'
                : 'cursor-zoom-in',
            ].join(' ')}
            style={{
              width: 'auto',
              height: 'auto',
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: dragging ? undefined : 'transform 120ms ease-out',
              imageRendering: 'auto',
            }}
          />
        </div>

        <p className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 border border-rpg-border/60 bg-rpg-panel/90 px-3 py-1.5 font-sans text-[11px] text-rpg-ink-dim sm:block">
          Clique para ampliar · scroll para zoom · arraste para mover · Esc fecha
        </p>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-2 border-t-2 border-rpg-border bg-rpg-panel/95 px-3 py-2 sm:hidden">
        <ControlButton label="Aumentar zoom" onClick={() => applyZoom(zoom + ZOOM_STEP)} disabled={!canZoomIn}>
          <Maximize2 size={16} />
          Ampliar
        </ControlButton>
        <ControlButton label="Resetar zoom" onClick={resetView} disabled={zoom === MIN_ZOOM}>
          <RotateCcw size={16} />
          Reset
        </ControlButton>
      </div>
    </div>,
    document.body,
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={event => {
        event.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center gap-1.5 border-2 border-rpg-border bg-rpg-parchment px-2 py-1.5 font-sans text-xs text-rpg-ink-dim transition-colors hover:border-rpg-gold-dark hover:text-rpg-ink-dark disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
