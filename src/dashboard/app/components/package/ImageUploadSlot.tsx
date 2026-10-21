"use client";
import React, { useState, useRef } from 'react';
import { Upload, RefreshCw, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface ImageUploadSlotProps {
  label: string;
  preview: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
  compact?: boolean;
}

/**
 * Converts any image File or Blob (JPEG, PNG, AVIF, GIF, etc.) to a WebP File.
 * Caps maximum dimensions to 2560px for optimal performance and size.
 */
async function convertToWebp(fileOrBlob: Blob | File, originalName: string = 'image'): Promise<File> {
  // If already WebP and within 5MB, retain as is
  if (
    (fileOrBlob.type === 'image/webp' || originalName.toLowerCase().endsWith('.webp')) &&
    fileOrBlob.size <= MAX_FILE_SIZE_BYTES
  ) {
    if (fileOrBlob instanceof File) return fileOrBlob;
    const cleanName = originalName.endsWith('.webp') ? originalName : `${originalName}.webp`;
    return new File([fileOrBlob], cleanName, { type: 'image/webp' });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(fileOrBlob);

    img.onload = () => {
      try {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement('canvas');
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        const maxDim = 2560;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context unavailable');
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              if (fileOrBlob instanceof File) resolve(fileOrBlob);
              else resolve(new File([fileOrBlob], `${originalName}.webp`, { type: 'image/webp' }));
              return;
            }
            const cleanName = originalName.replace(/\.[^/.]+$/, '');
            const finalFile = new File([blob], `${cleanName || 'image'}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(finalFile);
          },
          'image/webp',
          0.92
        );
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode image data'));
    };

    img.src = objectUrl;
  });
}

/**
 * Extracts image URL or Google Images link from DataTransfer when dragging across browser tabs/sites
 */
function extractImageUrlFromDataTransfer(dt: DataTransfer): string | null {
  // 1. Check HTML snippet (Google Images and most browsers send HTML on drag)
  const html = dt.getData('text/html');
  if (html) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Check if wrapped in Google Images search result link (contains "imgurl=")
      const links = Array.from(doc.querySelectorAll('a'));
      for (const a of links) {
        if (a.href) {
          try {
            const parsed = new URL(a.href, window.location.href);
            const imgurl = parsed.searchParams.get('imgurl');
            if (imgurl && /^https?:\/\//i.test(imgurl)) {
              return decodeURIComponent(imgurl);
            }
          } catch {}
        }
      }

      // Check for direct <img> tags in dragged content
      const img = doc.querySelector('img');
      if (img?.src) {
        if (img.src.startsWith('data:image/') || /^https?:\/\//i.test(img.src)) {
          return img.src;
        }
      }
    } catch (e) {
      console.warn('Failed parsing dragged HTML:', e);
    }
  }

  // 2. Check uri-list
  const uriList = dt.getData('text/uri-list');
  if (uriList) {
    const lines = uriList.split(/\r?\n/).map(l => l.trim()).filter(l => Boolean(l) && !l.startsWith('#'));
    for (const line of lines) {
      if (/^https?:\/\//i.test(line) || line.startsWith('data:image/')) {
        return line;
      }
    }
  }

  // 3. Check plain text
  const text = dt.getData('text/plain')?.trim();
  if (text) {
    if (text.startsWith('data:image/') || /^https?:\/\//i.test(text)) {
      try {
        const parsed = new URL(text);
        const imgurl = parsed.searchParams.get('imgurl');
        if (imgurl && /^https?:\/\//i.test(imgurl)) {
          return decodeURIComponent(imgurl);
        }
      } catch {}
      return text;
    }
  }

  return null;
}

export function ImageUploadSlot({
  label,
  preview,
  onFile,
  onClear,
  compact = false,
}: ImageUploadSlotProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const processIncomingFile = async (file: File) => {
    const isImage = file.type.startsWith('image/') || /\.(webp|jpe?g|png|avif|gif|bmp|tiff?)$/i.test(file.name);
    if (!isImage) {
      setError('Only image files (WebP, JPG, PNG, etc.) are allowed.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File size too large (max 25MB).');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Converting to WebP…');
    setError(null);

    try {
      const webpFile = await convertToWebp(file, file.name);
      if (webpFile.size > MAX_FILE_SIZE_BYTES) {
        setError(`Converted image exceeds ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      onFile(webpFile);
    } catch (err: any) {
      console.error('File conversion error:', err);
      setError('Failed to convert image to WebP.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const processIncomingUrl = async (url: string) => {
    setIsProcessing(true);
    setProcessingStatus('Fetching dropped image…');
    setError(null);

    try {
      let blob: Blob | null = null;

      if (url.startsWith('data:image/')) {
        const res = await fetch(url);
        blob = await res.blob();
      } else {
        // External image: attempt direct fetch first
        try {
          const res = await fetch(url, { mode: 'cors' });
          if (res.ok) {
            const ct = res.headers.get('content-type') || '';
            if (ct.startsWith('image/')) {
              blob = await res.blob();
            }
          }
        } catch {
          // Direct fetch blocked by CORS, proceed to server proxy
        }

        // Fallback to our proxy API route
        if (!blob) {
          setProcessingStatus('Loading via proxy…');
          const proxyRes = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
          if (!proxyRes.ok) {
            throw new Error('Could not load external image from this source.');
          }
          blob = await proxyRes.blob();
        }
      }

      if (!blob || blob.size === 0) {
        throw new Error('Retrieved image is empty.');
      }

      setProcessingStatus('Auto-converting to WebP…');
      const webpFile = await convertToWebp(blob, 'dropped-image');
      onFile(webpFile);
    } catch (err: any) {
      console.error('Drop URL error:', err);
      setError(err?.message || 'Could not load dropped image. Try saving it locally first.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);
    setError(null);

    // 1. Check if files were dropped from local machine
    const dt = e.dataTransfer;
    if (dt.files && dt.files.length > 0) {
      const file = dt.files[0];
      await processIncomingFile(file);
      return;
    }

    // 2. Check if dragged from another browser tab or website (Google Images, etc.)
    const candidateUrl = extractImageUrlFromDataTransfer(dt);
    if (candidateUrl) {
      await processIncomingUrl(candidateUrl);
      return;
    }

    setError('No valid image detected in dropped item.');
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const dt = e.clipboardData;
    if (dt.files && dt.files.length > 0) {
      const file = dt.files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        await processIncomingFile(file);
        return;
      }
    }

    const candidateUrl = extractImageUrlFromDataTransfer(dt as unknown as DataTransfer);
    if (candidateUrl) {
      e.preventDefault();
      await processIncomingUrl(candidateUrl);
    }
  };

  const triggerFileSelect = () => {
    fileRef.current?.click();
  };

  const heightClass = compact ? 'h-[115px]' : 'h-[145px]';

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <label className="block text-[11px] font-semibold text-gray-700 truncate" title={label}>
          {label}
        </label>
        <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
          Auto WebP
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.webp,.jpg,.jpeg,.png,.avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) processIncomingFile(f);
          e.target.value = '';
        }}
      />

      {/* Interactive Drag & Drop Box */}
      <div
        className={`relative ${heightClass} rounded-lg overflow-hidden border-2 transition-all outline-hidden select-none ${
          isDragging
            ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-50/70 shadow-md'
            : preview
            ? 'border-gray-200 group shadow-xs bg-slate-900'
            : 'border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/30 bg-gray-50/50 cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        onKeyDown={(e) => {
          if (!preview && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            triggerFileSelect();
          }
        }}
        onClick={(e) => {
          // If no preview, clicking anywhere opens file dialog
          if (!preview && !isProcessing) {
            triggerFileSelect();
          }
        }}
      >
        {/* State A: Preview Mode */}
        {preview ? (
          <>
            <img
              src={preview}
              alt={label}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
            />

            {/* Default Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileSelect();
                }}
                className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-800 text-[10px] font-bold rounded shadow-sm flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                title="Replace this image"
              >
                <RefreshCw className="w-3 h-3 text-blue-600" />
                Replace
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded shadow-sm transition-transform active:scale-95 cursor-pointer"
                title="Remove this image"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Mobile Clear Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="sm:hidden absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center text-[10px] z-10 cursor-pointer"
              title="Remove"
            >
              ✕
            </button>
          </>
        ) : (
          /* State B: Empty Placeholder Mode */
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2 text-center pointer-events-none">
            <div className="w-7 h-7 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-[10px] text-gray-700 font-semibold leading-tight">
              Drop image or click
            </span>
            <span className="text-[8px] text-gray-400 font-normal">
              Any image • Auto WebP (4:5)
            </span>
          </div>
        )}

        {/* Active Dragging Overlay (Visible over BOTH preview and empty states) */}
        {isDragging && (
          <div className="absolute inset-0 z-30 bg-emerald-600/90 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 pointer-events-none transition-all animate-in fade-in">
            <Upload className="w-6 h-6 mb-1 text-white animate-bounce" />
            <span className="text-[11px] font-bold tracking-wide">
              {preview ? 'Drop to replace' : 'Drop image here'}
            </span>
            <span className="text-[9px] text-emerald-100 font-medium">Auto-converts to WebP</span>
          </div>
        )}

        {/* Processing / Converting Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 pointer-events-none">
            <Loader2 className="w-5 h-5 mb-1.5 animate-spin text-emerald-400" />
            <span className="text-[10px] font-semibold text-center">{processingStatus || 'Processing…'}</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-[9px] text-red-500 font-medium text-center leading-tight">
          {error}
        </p>
      )}
    </div>
  );
}
