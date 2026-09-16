import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./client";

// Admin image uploads (company logos, project images) go to Firebase Storage under `portfolio/`.
// Storage rules in docs/firebase-admin-setup.md restrict writes to the admin and to images under 5 MB.

export const IMAGE_UPLOAD_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/avif"] as const;
export const IMAGE_UPLOAD_MAX_BYTES = 2 * 1024 * 1024;

export type ImageUploadFolder = "experience-logos" | "project-images";

export type ImageUploadResult = { ok: true; url: string; path: string } | { ok: false; error: string };

export function validateImageFile(file: File): string | null {
  if (!IMAGE_UPLOAD_TYPES.includes(file.type as (typeof IMAGE_UPLOAD_TYPES)[number])) {
    return "Use a PNG, JPG, WebP, AVIF or SVG image.";
  }
  if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
    return `Images must be under ${IMAGE_UPLOAD_MAX_BYTES / 1024 / 1024} MB.`;
  }
  return null;
}

function safeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "image";
}

export async function uploadPortfolioImage(file: File, folder: ImageUploadFolder, key: string): Promise<ImageUploadResult> {
  if (!storage) return { ok: false, error: "Firebase Storage is not configured (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)." };

  const invalid = validateImageFile(file);
  if (invalid) return { ok: false, error: invalid };

  const path = `portfolio/${folder}/${safeName(key)}-${Date.now()}-${safeName(file.name)}`;
  try {
    const objectRef = ref(storage, path);
    await uploadBytes(objectRef, file, {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    });
    return { ok: true, url: await getDownloadURL(objectRef), path };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Upload failed." };
  }
}

/** Best-effort cleanup of an image previously uploaded through the admin console. */
export async function removeUploadedImage(url: string): Promise<void> {
  if (!storage || !url.includes("firebasestorage.googleapis.com")) return;
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // The file may already be gone or belong to another bucket; the CMS field is cleared either way.
  }
}
