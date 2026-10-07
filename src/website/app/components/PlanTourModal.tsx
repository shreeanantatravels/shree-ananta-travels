"use client";
import { X } from 'lucide-react';
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
  if (!isOpen) return null;

  const isQuoteMode = !!preselectedPackage;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors shadow-sm"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Package badge for Get Quote mode */}
        {isQuoteMode && preselectedPackage && (
          <div className="bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white px-6 py-4">
            <p className="text-xs text-white/70 uppercase tracking-wider font-medium mb-1">Getting quote for</p>
            <p className="font-bold text-lg">{preselectedPackage.title}</p>
            <p className="text-sm text-white/80">
              {preselectedPackage.location} · {preselectedPackage.duration} · ₹{preselectedPackage.price.toLocaleString()}/person
            </p>
          </div>
        )}

        {/* Scrollable form body */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
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
}
