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
    if (file.size > MAX_FILE_SIZE_BYTES) { setError(`Max ${MAX_FILE_SIZE_MB}MB.`); return; }
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
            className={`flex flex-col items-center justify-center gap-1 ${heightClass} border-2 border-dashed rounded-lg cursor-pointer transition-colors p-2 text-center ${
              dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <Upload className={compact ? "w-4 h-4 text-gray-400" : "w-6 h-6 text-gray-300"} />
            <span className="text-[11px] text-gray-600 font-medium leading-tight">Click or drag</span>
            <span className="text-[9px] text-gray-400">JPG, PNG · Max {MAX_FILE_SIZE_MB}MB</span>
          </label>
          {error && <p className="mt-0.5 text-[9px] text-red-500 text-center">{error}</p>}
        </div>
      )}
    </div>
  );
}
