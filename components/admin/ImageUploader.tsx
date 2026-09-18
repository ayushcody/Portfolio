"use client";

import { createContext, useContext, useEffect, useRef, useState, type DragEvent, type ReactNode } from "react";
import { ImageOff, ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { ExperienceLogo } from "@/components/ui/ExperienceLogo";
import { storage } from "@/lib/firebase/client";
import {
  IMAGE_UPLOAD_MAX_BYTES,
  IMAGE_UPLOAD_TYPES,
  removeUploadedImage,
  uploadPortfolioImage,
  validateImageFile,
  type ImageUploadFolder,
  type ImageUploadResult,
} from "@/lib/firebase/storage";
import { checkExternalUrl } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { friendlyError } from "./format";
import { useNotify } from "./status";
import { UrlField } from "./UrlField";

type UploadService = {
  /** False when NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is missing: uploads are disabled, URLs still work. */
  ready: boolean;
  upload: (file: File, folder: ImageUploadFolder, key: string) => Promise<ImageUploadResult>;
  remove: (url: string) => Promise<void>;
};

const UploadContext = createContext<UploadService>({
  ready: Boolean(storage),
  upload: uploadPortfolioImage,
  remove: removeUploadedImage,
});

/** Lets a caller swap the Storage implementation (used for local previews). */
export function ImageUploadProvider({ value, children }: { value: UploadService; children: ReactNode }) {
  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
}

// URLs uploaded in this browser session. Only these can be deleted from Storage, and only while unsaved.
const sessionUploads = new Set<string>();

/**
 * Deletes an image uploaded during this session that never made it into a saved document
 * (e.g. the admin uploaded, then cancelled or replaced it). Saved images are never deleted here.
 */
export function discardUnsavedUpload(url: string | undefined, persistedUrl: string | undefined, remove: UploadService["remove"] = removeUploadedImage) {
  if (!url || url === persistedUrl || !sessionUploads.has(url)) return;
  sessionUploads.delete(url);
  void remove(url);
}

export function useUploadService() {
  return useContext(UploadContext);
}

type ImageStatus = "empty" | "loading" | "loaded" | "error";

/** Probes an image URL so the admin sees when a pasted/uploaded URL does not load. */
function useImageStatus(src: string | undefined): ImageStatus {
  const [result, setResult] = useState<{ src: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!src) return;
    let active = true;
    const probe = new Image();
    probe.onload = () => active && setResult({ src, ok: true });
    probe.onerror = () => active && setResult({ src, ok: false });
    probe.src = src;
    return () => {
      active = false;
    };
  }, [src]);

  if (!src) return "empty";
  if (!result || result.src !== src) return "loading";
  return result.ok ? "loaded" : "error";
}

const ACCEPT = IMAGE_UPLOAD_TYPES.join(",");
const MAX_MB = IMAGE_UPLOAD_MAX_BYTES / 1024 / 1024;

type ImageUploaderProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  folder: ImageUploadFolder;
  /** Used in the Storage file name, usually the item id. */
  uploadKey: string;
  /** The value stored in the saved document; used to decide whether a replaced upload can be deleted. */
  persistedValue?: string;
  /** "logo": square company mark with initials fallback. "wide": 16:10 image. */
  variant: "logo" | "wide";
  /** Company name for the logo preview and initials fallback. */
  company?: string;
  alt?: string;
  error?: string;
  hint?: ReactNode;
  disabled?: boolean;
};

export function ImageUploader({
  id,
  label,
  value,
  onChange,
  onBlur,
  folder,
  uploadKey,
  persistedValue,
  variant,
  company,
  alt,
  error,
  hint,
  disabled,
}: ImageUploaderProps) {
  const service = useUploadService();
  const notify = useNotify();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const check = checkExternalUrl(value, "image");
  const previewSrc = check.ok ? check.value : undefined;
  const status = useImageStatus(previewSrc);
  const hasValue = Boolean(value.trim());
  const canUpload = service.ready && !disabled && !busy;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    const invalid = validateImageFile(file);
    if (invalid) {
      setUploadError(invalid);
      return;
    }
    if (!service.ready) {
      setUploadError("Uploads are unavailable: Firebase Storage is not configured. Paste an image URL instead.");
      return;
    }

    setBusy(true);
    const previous = value;
    try {
      const result = await service.upload(file, folder, uploadKey || "new-item");
      if (result.ok) {
        sessionUploads.add(result.url);
        onChange(result.url);
        discardUnsavedUpload(previous, persistedValue, service.remove);
        notify("info", `Uploaded ${file.name}. Save or publish to use it on the site.`);
      } else {
        setUploadError(friendlyError(result.error, "Upload failed."));
      }
    } catch (uploadFailure) {
      setUploadError(friendlyError(uploadFailure, "Upload failed."));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    const previous = value;
    onChange("");
    setUploadError(null);
    discardUnsavedUpload(previous, persistedValue, service.remove);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (!canUpload) return;
    void handleFile(event.dataTransfer.files?.[0]);
  }

  const statusText =
    status === "error"
      ? variant === "logo"
        ? "This image could not be loaded. The site will show the initials instead."
        : "This image could not be loaded. Check the URL or upload a file."
      : null;

  return (
    <div className={cn("adm-upload", `adm-upload--${variant}`)} role="group" aria-labelledby={`${id}-label`}>
      <p id={`${id}-label`} className="adm-field__label">
        {label}
      </p>
      <div className="adm-upload__body">
        <div
          className={cn("adm-upload__drop", dragging && "is-dragging", busy && "is-busy")}
          onDragOver={(event) => {
            if (!canUpload) return;
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {variant === "logo" ? (
            <div className="adm-upload__logo">
              <ExperienceLogo company={company?.trim() || "Company"} logo={previewSrc} size={96} tone="yellow" />
            </div>
          ) : (
            <div className="adm-upload__frame">
              {previewSrc && status !== "error" ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URLs
                <img src={previewSrc} alt={alt || "Thumbnail preview"} />
              ) : (
                <span className="adm-upload__empty">
                  {status === "error" ? <ImageOff size={22} aria-hidden="true" /> : <ImagePlus size={22} aria-hidden="true" />}
                  {status === "error" ? "Image failed to load" : "No image"}
                </span>
              )}
            </div>
          )}
          {busy ? (
            <span className="adm-upload__overlay">
              <Loader2 size={18} className="adm-spin" aria-hidden="true" />
              Uploading…
            </span>
          ) : null}
        </div>

        <div className="adm-upload__controls">
          <div className="adm-upload__buttons">
            <input
              ref={inputRef}
              id={`${id}-file`}
              type="file"
              accept={ACCEPT}
              className="visually-hidden"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
            <button
              type="button"
              className="adm-btn"
              aria-disabled={!canUpload || undefined}
              aria-describedby={`${id}-upload-hint`}
              onClick={() => canUpload && inputRef.current?.click()}
            >
              {busy ? (
                <Loader2 size={15} className="adm-spin" aria-hidden="true" />
              ) : hasValue ? (
                <RefreshCw size={15} aria-hidden="true" />
              ) : (
                <ImagePlus size={15} aria-hidden="true" />
              )}
              {busy ? "Uploading…" : hasValue ? "Replace file" : "Upload file"}
            </button>
            {hasValue ? (
              <button type="button" className="adm-btn adm-btn--danger-text" onClick={handleRemove} disabled={disabled || busy}>
                <Trash2 size={15} aria-hidden="true" />
                Remove
              </button>
            ) : null}
          </div>
          <p id={`${id}-upload-hint`} className="adm-field__hint">
            {service.ready
              ? `PNG, JPG, WebP, AVIF or SVG, up to ${MAX_MB} MB. Drop a file on the preview or choose one.`
              : "Uploads are off: Firebase Storage is not configured (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET). Paste a URL or /public path instead."}
          </p>
          {uploadError ? (
            <p className="adm-field__error" role="alert">
              {uploadError}
            </p>
          ) : null}

          <UrlField
            id={id}
            label="Image URL or /public path"
            value={value}
            onChange={(next) => {
              setUploadError(null);
              onChange(next);
            }}
            onBlur={onBlur}
            kind="image"
            removable={false}
            placeholder={variant === "logo" ? "/logos/company.svg or https://…" : "/images/project.png or https://…"}
            error={error}
            hint={statusText ?? hint}
            disabled={disabled || busy}
          />
        </div>
      </div>
    </div>
  );
}
