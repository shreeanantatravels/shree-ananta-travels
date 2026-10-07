"use client";
import React, { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';

interface TagEntryFieldProps {
  label: string;
  items: string[];
  onAdd: (val: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  accentColor: 'green' | 'red' | 'gray';
  icon: React.ReactNode;
}

export function TagEntryField({
  label,
  items = [],
  onAdd,
  onRemove,
  placeholder,
  accentColor,
  icon,
}: TagEntryFieldProps) {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const colorMap = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      accent: 'text-green-600',
      tagBg: 'bg-green-100',
      tagText: 'text-green-800',
      tagRemove: 'hover:bg-green-200 text-green-500 hover:text-green-700',
      addBtn: 'bg-green-600 hover:bg-green-700',
      focusRing: 'focus:ring-green-400',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      accent: 'text-red-500',
      tagBg: 'bg-red-100',
      tagText: 'text-red-800',
      tagRemove: 'hover:bg-red-200 text-red-400 hover:text-red-700',
      addBtn: 'bg-red-500 hover:bg-red-600',
      focusRing: 'focus:ring-red-400',
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      accent: 'text-gray-500',
      tagBg: 'bg-gray-200',
      tagText: 'text-gray-800',
      tagRemove: 'hover:bg-gray-300 text-gray-500 hover:text-gray-700',
      addBtn: 'bg-gray-600 hover:bg-gray-700',
      focusRing: 'focus:ring-gray-400',
    },
  };

  const c = colorMap[accentColor];

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    if (items.includes(trimmed)) {
      setError('Already added');
      return;
    }

    setError(null);
    onAdd(trimmed);
    setInputVal('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === 'Escape') {
      setInputVal('');
      setError(null);
    }
  };

  return (
    <div className={`${c.bg} rounded p-4 border ${c.border}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={c.accent}>{icon}</span>
        <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
        {items.length > 0 && (
          <span className={`ml-auto text-[10px] font-semibold ${c.accent} bg-white px-2 py-0.5 rounded-full border ${c.border}`}>
            {items.length} added
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-3">Add items one at a time · type & press <strong>Enter</strong> or click <strong>+ Add</strong></p>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {items.map((item, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.tagBg} ${c.tagText}`}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${c.tagRemove}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={e => {
              setInputVal(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputVal.trim()) {
                handleAdd();
              }
            }}
            placeholder={placeholder}
            className={`w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded focus:ring-2 ${c.focusRing} focus:border-transparent transition-all`}
          />
          {error && (
            <p className="mt-1 text-[10px] text-red-500 font-medium">{error}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputVal.trim()}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${c.addBtn}`}
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {items.length === 0 && (
        <p className="mt-2 text-[10px] text-gray-400 text-center">No items added yet — type above and press Enter or Add</p>
      )}
    </div>
  );
}
