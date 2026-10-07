"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CustomCategoryModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

export function CustomCategoryModal({ onSave, onClose }: CustomCategoryModalProps) {
  const [value, setValue] = useState('');
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-80 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">New Type</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          autoFocus
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && value.trim()) { onSave(value.trim()); }
            if (e.key === 'Escape') onClose();
          }}
          placeholder="e.g., Eco Tour, Spiritual…"
          className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            disabled={!value.trim()}
            onClick={() => onSave(value.trim())}
            className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed">
            Save Type
          </button>
        </div>
      </div>
    </div>
  );
}

