"use client";
import React, { useState } from 'react';
import { Tag as TagIcon, Plus, X } from 'lucide-react';
import { Input } from "../ui/input";
import { SUGGESTED_PACKAGE_TAGS } from '@/lib/utils/packageSeoHelper';

interface PackageTagsSectionProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export function PackageTagsSection({ tags, setTags }: PackageTagsSectionProps) {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (customVal?: string) => {
    const val = (customVal !== undefined ? customVal : tagInput).trim();
    if (!val) return;
    if (!tags.includes(val)) {
      setTags(prev => [...prev, val]);
    }
    if (customVal === undefined) {
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const availableSuggested = SUGGESTED_PACKAGE_TAGS.filter(t => !tags.includes(t));

  return (
    <div className="bg-purple-50/70 rounded-xl p-4 border border-purple-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TagIcon className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-bold text-gray-900">Package Tags</h3>
          {tags.length > 0 && (
            <span className="text-[10px] font-semibold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
              {tags.length} selected
            </span>
          )}
        </div>
        <span className="text-[11px] text-gray-500">
          Used for website filtering & related tour packages
        </span>
      </div>

      {/* Selected tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-200"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(idx)}
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-purple-500 hover:text-red-600 hover:bg-purple-200 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add Tag Input */}
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="Type a tag (e.g., Spiritual Tour, Luxury Stays) and press Enter..."
          className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 transition-all h-auto"
        />
        <button
          type="button"
          onClick={() => handleAddTag()}
          disabled={!tagInput.trim()}
          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {/* Quick suggestions */}
      {availableSuggested.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] text-gray-500 font-medium">Quick Add:</span>
          {availableSuggested.slice(0, 8).map(st => (
            <button
              key={st}
              type="button"
              onClick={() => handleAddTag(st)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 hover:border-purple-300 transition-all cursor-pointer"
            >
              <Plus className="w-2.5 h-2.5" />
              {st}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
