"use client";
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, ListPlus, RotateCcw, Copy, Check } from 'lucide-react';

export interface TagEntryFieldProps {
  label: string;
  items: string[];
  onAdd: (val: string) => void;
  onRemove: (index: number) => void;
  onClearAll?: () => void;
  onAddMany?: (vals: string[]) => void;
  onReplaceAll?: (vals: string[]) => void;
  placeholder: string;
  accentColor: 'green' | 'red' | 'gray';
  icon: React.ReactNode;
}

export function parseBulkInput(text: string): string[] {
  if (!text || !text.trim()) return [];

  // Split by newlines first
  const lines = text.split(/\r?\n/);
  const parsed: string[] = [];

  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    // Strip bullet points, numbering (e.g., "1.", "1)", "1 -", "a.", "•", "-", "*", etc.)
    line = line
      .replace(/^(\d+[\.\)\-:]|\([0-9a-zA-Z]+\)|[a-zA-Z][\.\)]|[•\-\*\u2022\u2023\u25E6\u2043\u2219▪▫–—])\s*/u, '')
      .trim();

    // Second pass in case there are double bullets like "• 1. something"
    line = line
      .replace(/^(\d+[\.\)\-:]|\([0-9a-zA-Z]+\)|[a-zA-Z][\.\)]|[•\-\*\u2022\u2023\u25E6\u2043\u2219▪▫–—])\s*/u, '')
      .trim();

    if (line) {
      parsed.push(line);
    }
  }

  // If user entered everything on one line separated by semicolons (or commas if multiple commas)
  if (parsed.length === 1) {
    const single = parsed[0];
    if (single.includes(';')) {
      const parts = single.split(';').map(p => p.trim()).filter(Boolean);
      if (parts.length > 1) return parts;
    } else if (single.includes(',') && single.split(',').length > 2) {
      const parts = single.split(',').map(p => p.trim()).filter(Boolean);
      if (parts.length > 1) return parts;
    }
  }

  return parsed;
}

export function TagEntryField({
  label,
  items = [],
  onAdd,
  onRemove,
  onClearAll,
  onAddMany,
  onReplaceAll,
  placeholder,
  accentColor,
  icon,
}: TagEntryFieldProps) {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [undoHistory, setUndoHistory] = useState<string[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const bulkTextareaRef = useRef<HTMLTextAreaElement>(null);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

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
      bulkBtnActive: 'bg-green-600 text-white border-green-600',
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
      bulkBtnActive: 'bg-red-600 text-white border-red-600',
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      accent: 'text-gray-600',
      tagBg: 'bg-gray-200',
      tagText: 'text-gray-800',
      tagRemove: 'hover:bg-gray-300 text-gray-500 hover:text-gray-700',
      addBtn: 'bg-gray-700 hover:bg-gray-800',
      focusRing: 'focus:ring-gray-400',
      bulkBtnActive: 'bg-gray-800 text-white border-gray-800',
    },
  };

  const c = colorMap[accentColor] || colorMap.gray;

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

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

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteText = e.clipboardData.getData('text');
    if (pasteText && (pasteText.includes('\n') || pasteText.includes('\r'))) {
      e.preventDefault();
      const parsed = parseBulkInput(pasteText);
      if (parsed.length > 1) {
        const newToAdd = parsed.filter(item => !items.includes(item));
        if (newToAdd.length > 0) {
          if (onAddMany) {
            onAddMany(newToAdd);
          } else {
            newToAdd.forEach(item => onAdd(item));
          }
          setInputVal('');
          setError(null);
          showSuccess(`Added ${newToAdd.length} items from paste!`);
        } else {
          setError('All pasted items are already in the list');
        }
      } else if (parsed.length === 1) {
        setInputVal(parsed[0]);
      }
    }
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

  const handleClearAll = () => {
    if (items.length === 0) return;
    const previous = [...items];
    setUndoHistory(previous);

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setUndoHistory(null);
    }, 8000);

    if (onClearAll) {
      onClearAll();
    } else if (onReplaceAll) {
      onReplaceAll([]);
    } else {
      for (let i = items.length - 1; i >= 0; i--) {
        onRemove(i);
      }
    }
    setError(null);
  };

  const handleUndo = () => {
    if (!undoHistory || undoHistory.length === 0) return;
    if (onReplaceAll) {
      onReplaceAll(undoHistory);
    } else if (onAddMany) {
      onAddMany(undoHistory);
    } else {
      undoHistory.forEach(item => onAdd(item));
    }
    showSuccess(`Restored ${undoHistory.length} items!`);
    setUndoHistory(null);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  };

  const detectedBulkItems = parseBulkInput(bulkText);

  const handleBulkAdd = () => {
    if (detectedBulkItems.length === 0) {
      setError('Please enter at least one item');
      return;
    }

    const toAdd = detectedBulkItems.filter(item => !items.includes(item));
    if (toAdd.length === 0) {
      setError('All entered items are already in the list');
      return;
    }

    if (onAddMany) {
      onAddMany(toAdd);
    } else {
      toAdd.forEach(item => onAdd(item));
    }

    showSuccess(`Added ${toAdd.length} items!`);
    setBulkText('');
    setIsBulkOpen(false);
    setError(null);
  };

  const handleBulkReplace = () => {
    if (detectedBulkItems.length === 0) {
      setError('Please enter at least one item');
      return;
    }

    if (items.length > 0) {
      setUndoHistory([...items]);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      undoTimerRef.current = setTimeout(() => {
        setUndoHistory(null);
      }, 8000);
    }

    if (onReplaceAll) {
      onReplaceAll(detectedBulkItems);
    } else if (onClearAll && onAddMany) {
      onClearAll();
      onAddMany(detectedBulkItems);
    } else {
      for (let i = items.length - 1; i >= 0; i--) onRemove(i);
      detectedBulkItems.forEach(item => onAdd(item));
    }

    showSuccess(`Replaced with ${detectedBulkItems.length} items!`);
    setBulkText('');
    setIsBulkOpen(false);
    setError(null);
  };

  return (
    <div className={`${c.bg} rounded p-4 border ${c.border} transition-colors`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className={c.accent}>{icon}</span>
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          {items.length > 0 && (
            <span className={`text-[11px] font-semibold ${c.accent} bg-white px-2 py-0.5 rounded-full border ${c.border} shadow-2xs`}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {/* Action buttons in header */}
        <div className="flex items-center gap-1.5 ml-auto">
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              title="Delete all items in 1 click"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded transition-all active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsBulkOpen(prev => !prev);
              setError(null);
              setTimeout(() => {
                bulkTextareaRef.current?.focus();
              }, 100);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border transition-all active:scale-95 cursor-pointer ${
              isBulkOpen
                ? c.bulkBtnActive
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>{isBulkOpen ? 'Close Bulk Add' : '+ Bulk Add'}</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Add items one at a time, or click <strong>+ Bulk Add</strong> to paste multiple items at once.
      </p>

      {/* Undo Alert Banner */}
      {undoHistory && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 mb-3 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-300 rounded shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span><strong>{undoHistory.length} items</strong> deleted.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              className="inline-flex items-center gap-1 px-2 py-0.5 font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 rounded transition-colors text-xs cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Undo
            </button>
            <button
              type="button"
              onClick={() => setUndoHistory(null)}
              className="text-amber-700 hover:text-amber-950 p-0.5 rounded cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center gap-2 px-3 py-2 mb-3 text-xs font-medium text-green-900 bg-green-50 border border-green-300 rounded shadow-xs">
          <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Bulk Add Expandable Section */}
      {isBulkOpen && (
        <div className="p-3 mb-3 bg-white border-2 border-indigo-200 rounded-lg shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-900 flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-indigo-600" />
              Bulk Add / Paste Multiple Items
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              detectedBulkItems.length > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {detectedBulkItems.length} {detectedBulkItems.length === 1 ? 'item' : 'items'} detected
            </span>
          </div>

          <p className="text-[11px] text-gray-500 leading-normal">
            Paste multiple terms below (one per line). Numbering like <em>1., 2.</em> and bullet points (•, -) are automatically removed.
          </p>

          <textarea
            ref={bulkTextareaRef}
            rows={4}
            value={bulkText}
            onChange={e => {
              setBulkText(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste your items here, for example:&#10;1. Booking confirmation applicable booking amount receive hone ke baad ki jayegi.&#10;2. Package price ₹14,500 per person on twin-sharing basis...&#10;3. Applicable 5% GST extra."
            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:bg-white focus:outline-none transition-all leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setIsBulkOpen(false);
                setBulkText('');
                setError(null);
              }}
              className="px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleBulkReplace}
                  disabled={detectedBulkItems.length === 0}
                  title="Replace all current items with these new ones"
                  className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Replace All ({detectedBulkItems.length})
                </button>
              )}
              <button
                type="button"
                onClick={handleBulkAdd}
                disabled={detectedBulkItems.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to List ({detectedBulkItems.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Items (Tags / Badges) */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 max-h-60 overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <span
              key={idx}
              className={`inline-flex items-start sm:items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold max-w-full break-words ${c.tagBg} ${c.tagText}`}
            >
              <span className="break-words text-left leading-normal">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                title="Remove this item"
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${c.tagRemove}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Single Item Input */}
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
            onPaste={handleInputPaste}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded focus:ring-2 ${c.focusRing} focus:border-transparent transition-all`}
          />
          {error && (
            <p className="mt-1 text-[11px] text-red-500 font-medium">{error}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputVal.trim()}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${c.addBtn}`}
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {items.length === 0 && !isBulkOpen && (
        <p className="mt-2 text-[10px] text-gray-400 text-center">
          No items added yet — type above and press Enter, paste a list, or click <strong>+ Bulk Add</strong>
        </p>
      )}
    </div>
  );
}
