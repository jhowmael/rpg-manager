import { uploadImage } from '../services/imageService';

export async function resolveImageUpload(
  imageFile: File | null | undefined,
  imagemId?: string,
): Promise<string | undefined> {
  if (imageFile) {
    const uploaded = await uploadImage(imageFile);
    return uploaded.id;
  }
  return imagemId;
}
