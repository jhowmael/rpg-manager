import { useEffect, useState } from 'react';
import { formatTimer } from '../utils/combat';

export function useTurnTimer(
  minutesPerTurn: number,
  startedAt: number | null,
  paused: boolean,
) {
  const totalSeconds = minutesPerTurn * 60;
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (!startedAt || paused) return;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(0, totalSeconds - elapsed));
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startedAt, paused, totalSeconds]);

  useEffect(() => {
    if (startedAt) setRemaining(totalSeconds);
  }, [startedAt, totalSeconds]);

  return {
    remaining,
    formatted: formatTimer(remaining),
    expired: remaining <= 0,
    totalSeconds,
  };
}
