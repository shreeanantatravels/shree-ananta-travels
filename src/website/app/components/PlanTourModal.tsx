"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, MapPin, Compass } from 'lucide-react';
import { EnquiryForm } from './EnquiryForm';

interface PlanTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** If provided, the modal is in "Get Quote" mode with the package pre-selected */
  preselectedPackage?: {
    title: string;
    location: string;
    price: number;
    duration: string;
  } | null;
}

export function PlanTourModal({ isOpen, onClose, preselectedPackage }: PlanTourModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const isQuoteMode = !!preselectedPackage;

  const modalContent = (
    <div
      className="fixed inset-0 z-[999999] overflow-y-auto bg-slate-900/40 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-tour-modal-title"
    >
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden my-auto border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {isQuoteMode && preselectedPackage ? (
          <div className="relative bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white px-6 py-5 pr-14 select-none">
            <button
              onClick={onClose}
              type="button"
              aria-label="Close modal"
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-black/20 hover:bg-black/35 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-white/80 uppercase tracking-widest font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Getting Quote For
            </div>
            <h3 id="plan-tour-modal-title" className="font-extrabold text-xl sm:text-2xl tracking-tight leading-snug">
              {preselectedPackage.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 mt-1 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5" /> {preselectedPackage.location}</span>
              <span>•</span>
              <span>{preselectedPackage.duration}</span>
              {preselectedPackage.price > 0 && (
                <>
                  <span>•</span>
                  <span className="font-bold">₹{preselectedPackage.price.toLocaleString('en-IN')}/person</span>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="relative bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white px-6 py-5 pr-14 select-none">
            <button
              onClick={onClose}
              type="button"
              aria-label="Close modal"
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-black/20 hover:bg-black/35 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-white/80 uppercase tracking-widest font-bold mb-1">
              <Compass className="w-4 h-4" /> Customized Tour Planning
            </div>
            <h3 id="plan-tour-modal-title" className="font-extrabold text-xl sm:text-2xl tracking-tight leading-snug">
              Plan Your Dream Vacation
            </h3>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Share your preferences & get a curated itinerary and best price quote within 2 hours.
            </p>
          </div>
        )}

        {/* Scrollable form body */}
        <div className="overflow-y-auto max-h-[calc(88vh-100px)]">
          <EnquiryForm
            compact
            hideHeader={true}
            prefilledDestination={preselectedPackage?.location || ''}
            prefilledPackageName={preselectedPackage?.title || ''}
            prefilledDuration={preselectedPackage?.duration?.match(/\d+/)?.[0] || ''}
            lockDestination={isQuoteMode}
            onSubmitSuccess={onClose}
            source={isQuoteMode ? 'package_detail' : 'hero_form'}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
