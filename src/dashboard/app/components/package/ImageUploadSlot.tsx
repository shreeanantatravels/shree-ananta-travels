"use client";
import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface ImageUploadSlotProps {
  label: string;
  preview: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
  compact?: boolean;
}

export function ImageUploadSlot({
  label, preview, onFile, onClear, compact = false,
}: ImageUploadSlotProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) { 
      setError(`Max ${MAX_FILE_SIZE_MB}MB.`); 
      return; 
    }
    
    const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
    if (!isWebp) {
      setError('Only WebP (.webp) images are allowed.');
      return;
    }

    setError(null);
    onFile(file);
  };

  const heightClass = compact ? 'h-[105px]' : 'h-[140px]';

  return (
    <div className="w-full">
      <label className="block text-[10px] font-semibold text-gray-600 mb-1 truncate" title={label}>{label}</label>
      {preview ? (
        <div className={`relative ${heightClass} rounded-lg overflow-hidden border border-gray-200 group shadow-xs`}>
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button onClick={onClear}
            className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] transition-colors shadow-sm">✕</button>
        </div>
      ) : (
        <div className="flex flex-col">
          <label
            className={`group flex flex-col items-center justify-center gap-1 ${heightClass} border border-dashed rounded-lg cursor-pointer transition-all p-2 text-center ${
              dragging 
                ? 'border-emerald-500 bg-emerald-50/70' 
                : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/30 bg-gray-50/50'
            }`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          >
            <input ref={fileRef} type="file" accept="image/webp,.webp" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <div className="w-6 h-6 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
              <Upload className="w-3 h-3 text-emerald-600" />
            </div>
            <span className="text-[10px] text-gray-700 font-medium leading-tight">Select .webp</span>
            <span className="text-[8px] text-gray-400 font-normal">Max {MAX_FILE_SIZE_MB}MB</span>
          </label>
          {error && <p className="mt-0.5 text-[9px] text-red-500 text-center font-semibold">{error}</p>}
        </div>
      )}
    </div>
  );
}
