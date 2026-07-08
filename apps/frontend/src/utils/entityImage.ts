const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export function getEntityImageUrl(imagemId?: string | null): string | undefined {
  if (!imagemId) return undefined;
  if (imagemId.startsWith('http://') || imagemId.startsWith('https://') || imagemId.startsWith('data:')) {
    return imagemId;
  }
  return `${API_BASE_URL}/uploads/${imagemId}`;
}
