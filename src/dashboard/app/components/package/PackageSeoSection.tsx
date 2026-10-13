"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Globe, Search, Plus, X, HelpCircle } from 'lucide-react';
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  generatePackageSeoTitle,
  generatePackageMetaDescription,
  generatePackageFocusKeyword,
  generatePackageRelatedKeywords,
} from '@/lib/utils/packageSeoHelper';

interface PackageSeoSectionProps {
  title: string;
  slug: string;
  location: string;
  duration: string;
  category: string;
  description: string;
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
  focusKeyword: string;
  setFocusKeyword: (v: string) => void;
  relatedKeywords: string[];
  setRelatedKeywords: React.Dispatch<React.SetStateAction<string[]>>;
}

export function PackageSeoSection({
  title,
  slug,
  location,
  duration,
  category,
  description,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  focusKeyword,
  setFocusKeyword,
  relatedKeywords,
  setRelatedKeywords,
}: PackageSeoSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [kwInput, setKwInput] = useState('');

  const displaySlug = slug || 'package-slug';
  const previewTitle = seoTitle || (title ? `${title} | Shree Ananta Travels` : 'Tour Package | Shree Ananta Travels');
  const previewDescription =
    seoDescription ||
    (description
      ? description.slice(0, 155) + '...'
      : `Explore the best of ${location || 'India'} with Shree Ananta Travels. Personalized itineraries, verified hotels, and seamless transfers.`);

  // Title character count status
  const titleLen = seoTitle.length;
  const titleStatusColor =
    titleLen === 0
      ? 'text-gray-400'
      : titleLen >= 40 && titleLen <= 60
      ? 'text-emerald-600 font-semibold'
      : titleLen > 60
      ? 'text-amber-600 font-semibold'
      : 'text-gray-500';

  // Description character count status
  const descLen = seoDescription.length;
  const descStatusColor =
    descLen === 0
      ? 'text-gray-400'
      : descLen >= 120 && descLen <= 160
      ? 'text-emerald-600 font-semibold'
      : descLen > 160
      ? 'text-amber-600 font-semibold'
      : 'text-gray-500';

  const handleAutoSuggestTitle = () => {
    const suggested = generatePackageSeoTitle(title, location);
    setSeoTitle(suggested);
  };

  const handleAutoSuggestDesc = () => {
    const suggested = generatePackageMetaDescription(title, location, duration, description);
    setSeoDescription(suggested);
  };

  const handleAutoSuggestFocusKw = () => {
    const suggested = generatePackageFocusKeyword(title, location);
    setFocusKeyword(suggested);
  };

  const suggestedKws = generatePackageRelatedKeywords(title, location, category).filter(
    k => !relatedKeywords.includes(k)
  );

  const handleAddKeyword = (val?: string) => {
    const toAdd = (val !== undefined ? val : kwInput).trim();
    if (!toAdd) return;
    if (!relatedKeywords.includes(toAdd)) {
      setRelatedKeywords(prev => [...prev, toAdd]);
    }
    if (val === undefined) {
      setKwInput('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setRelatedKeywords(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-100/70 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              SEO Settings & Search Metadata
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Google & Social Previews
              </span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Control the package search snippet, focus keywords, and SERP display
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-xs font-medium text-gray-600 hidden sm:inline">
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Live Google Search Preview Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-600" /> Google Search Result Preview
              </span>
              <span className="text-[10px] text-slate-400">Desktop & Mobile snippet</span>
            </div>

            <div className="space-y-1 font-sans">
              <div className="flex items-center gap-2 text-[12px] text-slate-700">
                <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] font-bold">
                  A
                </div>
                <div className="truncate text-slate-800 text-xs">
                  <span>shreeanantatravels.com</span>
                  <span className="text-slate-400 mx-1">›</span>
                  <span className="text-slate-600">packages</span>
                  <span className="text-slate-400 mx-1">›</span>
                  <span className="text-slate-900 font-medium">{displaySlug}</span>
                </div>
              </div>

              <h4 className="text-[15px] font-medium text-blue-700 hover:underline cursor-pointer leading-tight truncate">
                {previewTitle}
              </h4>

              <p className="text-[12px] text-slate-600 line-clamp-2 leading-relaxed">
                {previewDescription}
              </p>
            </div>
          </div>

          {/* Field A: SEO Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                SEO Title
                <span className="text-[10px] font-normal text-gray-400">(Meta Title)</span>
              </label>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] ${titleStatusColor}`}>
                  {titleLen} / 60 chars {titleLen > 60 && '(long)'}
                </span>
                <button
                  type="button"
                  onClick={handleAutoSuggestTitle}
                  disabled={!title}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Suggest Title
                </button>
              </div>
            </div>
            <Input
              type="text"
              value={seoTitle}
              onChange={e => setSeoTitle(e.target.value)}
              placeholder="e.g. Do Dham Yatra by Helicopter | Shree Ananta Travels"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 transition-all h-auto"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Recommended: 50–60 characters. Clean and brand-aligned without repeating keywords.
            </p>
          </div>

          {/* Field B: Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                Meta Description
                <span className="text-[10px] font-normal text-gray-400">(Search snippet)</span>
              </label>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] ${descStatusColor}`}>
                  {descLen} / 160 chars {descLen > 160 && '(may truncate)'}
                </span>
                <button
                  type="button"
                  onClick={handleAutoSuggestDesc}
                  disabled={!title}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Suggest Description
                </button>
              </div>
            </div>
            <Textarea
              rows={2}
              value={seoDescription}
              onChange={e => setSeoDescription(e.target.value)}
              placeholder="e.g. Book 6 Days Do Dham Yatra by Helicopter in Uttarakhand with Shree Ananta Travels. Personalized itineraries and VIP assistance."
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Recommended: 130–160 characters. Accurately describes what travelers will experience.
            </p>
          </div>

          {/* Field C: Primary Focus Keyword */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                Primary Focus Keyword
                <span className="text-[10px] font-normal text-gray-400">(Target search phrase)</span>
              </label>
              <button
                type="button"
                onClick={handleAutoSuggestFocusKw}
                disabled={!title}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Suggest Keyword
              </button>
            </div>
            <Input
              type="text"
              value={focusKeyword}
              onChange={e => setFocusKeyword(e.target.value)}
              placeholder="e.g. Do Dham Yatra by Helicopter"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 transition-all h-auto"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              The primary query this package should rank for on Google and internal search.
            </p>
          </div>

          {/* Field D: Related Keywords */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                Related Keywords
                <span className="text-[10px] font-normal text-gray-400">
                  ({relatedKeywords.length} added)
                </span>
              </label>
              <span className="text-[10px] text-gray-400">For internal SEO & search guidance</span>
            </div>

            {/* Keyword Chips */}
            {relatedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {relatedKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(idx)}
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-blue-500 hover:text-red-600 hover:bg-blue-100 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input + Add button */}
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                value={kwInput}
                onChange={e => setKwInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="Type a related keyword and press Enter..."
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 transition-all h-auto"
              />
              <button
                type="button"
                onClick={() => handleAddKeyword()}
                disabled={!kwInput.trim()}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* Suggested Variations Pills */}
            {suggestedKws.length > 0 && (
              <div className="mt-2 flex items-center flex-wrap gap-1.5">
                <span className="text-[10px] text-gray-500 font-medium">Suggestions:</span>
                {suggestedKws.map((sKw, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => handleAddKeyword(sKw)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    {sKw}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
