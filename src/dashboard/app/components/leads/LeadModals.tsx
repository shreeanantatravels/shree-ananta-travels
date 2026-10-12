"use client";
/**
 * LeadModals.tsx
 *
 * Modal used in the Leads page:
 *   - ManualEntryModal — form to add a lead manually
 *
 * Manages only its own local form state.
 * Data writes go up via onSubmit callback to Leads.tsx.
 */

import { useState } from 'react';
import { XCircle, Plus } from 'lucide-react';
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

// ── ManualEntryModal ───────────────────────────────────────────────────────────

export interface ManualFormData {
  name: string;
  phone: string;
  email: string;
  destination: string;
  fromCity: string;
  travelers: number;
  budget: string;
  message: string;
}

const EMPTY_FORM: ManualFormData = {
  name: '', phone: '', email: '', destination: '',
  fromCity: '', travelers: 1, budget: '', message: '',
};

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ManualFormData) => void;
}

export function ManualEntryModal({ isOpen, onClose, onSubmit }: ManualEntryModalProps) {
  const [form, setForm] = useState<ManualFormData>(EMPTY_FORM);

  if (!isOpen) return null;

  const set = (field: keyof ManualFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: field === 'travelers' ? parseInt(e.target.value) || 1 : e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" /> Add Manual Lead
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
              <Input required type="text" value={form.name} onChange={set('name')} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm h-auto" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
              <Input required type="tel" value={form.phone} onChange={set('phone')} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm h-auto" placeholder="e.g. +91 7289037447" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <Input type="email" value={form.email} onChange={set('email')} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm h-auto" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Travelers</label>
              <Input type="number" min="1" value={form.travelers} onChange={set('travelers')} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm h-auto" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">From City *</label>
              <Input required type="text" value={form.fromCity} onChange={set('fromCity')} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm h-auto" placeholder="Delhi" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Destination *</label>
              <Input required type="text" value={form.destination} onChange={set('destination')} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm h-auto" placeholder="Maldives" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Budget</label>
            <Input type="text" value={form.budget} onChange={set('budget')} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm h-auto" placeholder="e.g. ₹50,000" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Message / Notes</label>
            <Textarea value={form.message} onChange={set('message')} rows={3} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="Customer requirements..." />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
