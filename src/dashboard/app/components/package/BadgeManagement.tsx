"use client";
import React, { useState } from 'react';
import { Plus, Palette, X } from 'lucide-react';

export interface BadgeDef {
  id: string;
  label: string;
  textColor: string;
  bgColor: string;
  isCustom?: boolean;
}

export function BadgePill({ badge, selected, onClick }: { badge: BadgeDef; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: badge.bgColor, color: badge.textColor }}
      className={`relative inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all select-none
        ${selected
          ? 'ring-2 ring-offset-2 ring-gray-400 scale-105 shadow-md'
          : 'opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-sm'
        }`}
    >
      {badge.label}
      {selected && <span className="ml-1.5 text-[9px] opacity-80">✓</span>}
    </button>
  );
}

export function CustomBadgeBuilder({ onAdd }: { onAdd: (badge: BadgeDef) => void }) {
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#6366f1');
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd({ id: `custom-${Date.now()}`, label: text.trim(), textColor, bgColor, isCustom: true });
    setText('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border-2 border-dashed border-purple-300 text-purple-500 hover:border-purple-400 hover:bg-purple-50 transition-all"
      >
        <Plus className="w-3 h-3" /> Custom Badge
      </button>
    );
  }

  return (
    <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="w-3.5 h-3.5 text-purple-500" />
        <span className="text-xs font-semibold text-gray-700">Create Custom Badge</span>
        <button onClick={() => setOpen(false)} className="ml-auto text-gray-400 hover:text-gray-600">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Label</label>
          <input autoFocus type="text" value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="Badge text…"
            className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Text</label>
          <div className="relative w-9 h-[30px]">
            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="w-9 h-[30px] rounded border border-gray-300 cursor-pointer flex items-center justify-center text-[8px] font-bold overflow-hidden"
              style={{ backgroundColor: textColor, color: textColor === '#ffffff' ? '#666' : '#fff' }}>Aa</div>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Background</label>
          <div className="relative w-9 h-[30px]">
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="w-9 h-[30px] rounded border border-gray-300 cursor-pointer" style={{ backgroundColor: bgColor }} />
          </div>
        </div>
        {text.trim() && (
          <div className="flex flex-col items-start">
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Preview</label>
            <span style={{ backgroundColor: bgColor, color: textColor }}
              className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm">{text}</span>
          </div>
        )}
        <button onClick={handleAdd} disabled={!text.trim()}
          className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          Add
        </button>
      </div>
    </div>
  );
}

