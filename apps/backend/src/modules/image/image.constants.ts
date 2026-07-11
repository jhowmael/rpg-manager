export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

export function validateImageFile(file: Express.Multer.File): void {
  if (!file) {
    throw new Error('Arquivo de imagem é obrigatório');
  }

  if (!ALLOWED_MIME_TYPES[file.mimetype]) {
    throw new Error('Formato inválido. Use JPG, PNG, GIF ou WebP.');
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Imagem muito grande. Máximo de 2 MB.');
  }
}
