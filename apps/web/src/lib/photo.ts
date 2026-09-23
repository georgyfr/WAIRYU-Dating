/**
 * Pipeline photo client (Étape 3) : sélection → recadrage 4:5 (couverture
 * centrée) → compression WebP ~1024 px (~150-300 Ko) → Blob prêt pour
 * l'upload via le Worker (le client ne parle JAMAIS directement à Cloudinary).
 *
 * Fallback : si le navigateur ne sait pas encoder en WebP (Safari ancien),
 * on renvoie du JPEG — l'API accepte webp/jpeg/png.
 */
import { PROFILE_LIMITS } from '@wairyu/shared';

export interface ProcessedPhoto {
  blob: Blob;
  width: number;
  height: number;
  mime: 'image/webp' | 'image/jpeg';
}

export class PhotoError extends Error {}

/** Chargement robuste d'un fichier image en ImageBitmap. */
async function loadBitmap(file: File): Promise<ImageBitmap> {
  if (typeof createImageBitmap !== 'function') {
    throw new PhotoError('Ce navigateur ne supporte pas le traitement local des photos.');
  }
  try {
    return await createImageBitmap(file);
  } catch {
    throw new PhotoError('Fichier image illisible — choisis une autre photo.');
  }
}

export async function processPhoto(file: File): Promise<ProcessedPhoto> {
  if (file.size > 25 * 1024 * 1024) {
    throw new PhotoError('Photo trop lourde (max 25 Mo avant compression).');
  }
  const bmp = await loadBitmap(file);
  if (bmp.width < 200 || bmp.height < 200) {
    bmp.close();
    throw new PhotoError('Photo trop petite — minimum 200 px.');
  }

  const targetW = PROFILE_LIMITS.photoTargetWidth; // 1024
  const targetH = PROFILE_LIMITS.photoTargetHeight; // 1280 (4:5)

  // Recadrage « cover » centré vers 4:5.
  const scale = Math.max(targetW / bmp.width, targetH / bmp.height);
  const scaledW = Math.round(bmp.width * scale);
  const scaledH = Math.round(bmp.height * scale);
  const offsetX = Math.floor((scaledW - targetW) / 2);
  const offsetY = Math.floor((scaledH - targetH) / 2);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bmp.close();
    throw new PhotoError('Traitement local indisponible sur ce navigateur.');
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, -offsetX, -offsetY, scaledW, scaledH);
  bmp.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', PROFILE_LIMITS.photoWebpQuality),
  );
  if (blob && blob.type === 'image/webp') {
    return { blob, width: targetW, height: targetH, mime: 'image/webp' };
  }

  // Fallback JPEG (navigateur sans encodage WebP).
  const jpeg = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.85),
  );
  if (!jpeg) throw new PhotoError('Compression impossible sur ce navigateur.');
  return { blob: jpeg, width: targetW, height: targetH, mime: 'image/jpeg' };
}
