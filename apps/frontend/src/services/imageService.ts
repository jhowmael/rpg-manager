import { validateImageFile } from '../utils/imageUpload';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface ImageUploadResult {
  id: string;
  url: string;
}

export async function uploadImage(file: File): Promise<ImageUploadResult> {
  const error = validateImageFile(file);
  if (error) {
    throw new Error(error);
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      (body as { message?: string | string[] } | null)?.message ?? 'Falha ao enviar imagem';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return response.json() as Promise<ImageUploadResult>;
}
