"use client";
import { usePathname } from 'next/navigation';
/**
 * Leads.tsx
 *
 * Page shell for the Leads & Enquiries section.
 * Responsible for:
 *   - Reading + writing CRM state
 *   - Filtering leads by search / status
 *   - Highlight-on-navigate (from Revenue Analytics)
 *   - Laying out the header, stats bar, filter panel, and card grid
 *
 * Card rendering  → leads/LeadCard.tsx
 * Modal rendering → leads/LeadModals.tsx
 * Config/helpers  → leads/leadConfig.ts
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import {
  Search, Download, CheckCircle,
  Inbox, Bell, IndianRupee, Plus,
} from 'lucide-react';

import { useCRMContext, Lead, PackageLead } from '../context/CRMContext';
import { STATUS_CONFIG, ALL_STATUSES } from '../components/leads/leadConfig';
import { renderLeadCard } from '../components/leads/LeadCard';
import { ManualEntryModal, ManualFormData } from '../components/leads/LeadModals';
import { Input } from "../components/ui/input";
import { useUpdateLeadStatusMutation, leadsApi } from '../api/leadsApi';

export function Leads() {
  const router = useRouter();
  const pathname = usePathname(); const location = { pathname };
  const { leadsData, setLeadsData, leadStatuses, setLeadStatuses, dealValues, setDealValues } = useCRMContext();
  const [updateStatus] = useUpdateLeadStatusMutation();
  const dispatch = useDispatch();

  // ── Filter state ───────────────────────────────────────────────────────────
  const [searchTerm,   setSearchTerm]   = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // ── UI open/close state ────────────────────────────────────────────────────
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | number | null>(null);
  const [isManualModalOpen,  setIsManualModalOpen]  = useState(false);

  // ── Highlight state (navigated here from Revenue Analytics) ───────────────
  const [highlightedId, setHighlightedId] = useState<string | number | null>(null);
  const cardRefs = useRef<Record<string | number, HTMLDivElement | null>>({});

  useEffect(() => {
    const state = location.state as { highlightId?: number } | null;
    if (!state?.highlightId) return;

    const targetId = state.highlightId;
    setSearchTerm('');
    setFilterStatus('all');
    setHighlightedId(targetId);

    const timer = setTimeout(() => {
      cardRefs.current[targetId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setHighlightedId(null), 2500);
    }, 100);

    window.history.replaceState({}, '');
    return () => clearTimeout(timer);
  }, [location.state]);

  // ── Status change handler ──────────────────────────────────────────────────
  const handleStatusChange = async (leadId: string | number, newStatus: string) => {
    setLeadStatuses(prev => ({ ...prev, [leadId]: newStatus }));
    setOpenStatusDropdown(null);
    if (typeof leadId === 'string') {
      try {
        await updateStatus({ id: leadId, status: newStatus }).unwrap();
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };

  // ── Manual entry submit ────────────────────────────────────────────────────
  const handleManualSubmit = async (data: ManualFormData) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          toLocation: data.destination,
          fromLocation: data.fromCity,
          adults: data.travelers,
          budgetRupees: data.budget,
          specialRequests: data.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      dispatch(leadsApi.util.invalidateTags(['Lead']));
    } catch {
      alert('Failed to save lead. Please try again.');
    }
    setIsManualModalOpen(false);
  };


  // ── Filtered leads ─────────────────────────────────────────────────────────
  const filteredLeads = leadsData.filter(lead => {
    const pkg = (lead as PackageLead).packageName || '';
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      pkg?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || leadStatuses[lead.id] === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sharedCardProps = {
    highlightedId,
    cardRefs,
    openStatusDropdown,
    setOpenStatusDropdown,
    onStatusChange: handleStatusChange,
  };

  // ── Stats bar config ───────────────────────────────────────────────────────
  const stats = [
    { icon: Inbox,       label: 'Total Leads', value: leadsData.length,                                                                    change: '+12%', grad: 'from-blue-500 to-blue-600',     shadow: 'shadow-blue-500/30'   },
    { icon: CheckCircle, label: 'Contacted',   value: Object.values(leadStatuses).filter(s => s === 'contacted').length,                   change: '+8%',  grad: 'from-sky-500 to-cyan-500',      shadow: 'shadow-cyan-500/30'   },
    { icon: Bell,        label: 'Pending',     value: Object.values(leadStatuses).filter(s => s === 'pending').length,                     change: 'New',  grad: 'from-orange-500 to-red-500',    shadow: 'shadow-orange-500/30' },
    { icon: IndianRupee, label: 'Revenue',     value: `₹${Object.values(dealValues).reduce((a, b) => a + b, 0).toLocaleString('en-IN')}`,  change: '+15%', grad: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/30'  },
  ];

  return (
    <div className="space-y-5">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads &amp; Enquiries</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage customer enquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Manual Entry
          </button>
        </div>
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center shadow-lg ${s.shadow}`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.change}</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-gray-900 truncate" title={String(s.value)}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filter panel ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-sm space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search name, phone, destination..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto"
            />
          </div>
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Status</span>
          {(['all', ...ALL_STATUSES] as const).map(s => {
            const isAll = s === 'all';
            const c = isAll ? null : STATUS_CONFIG[s];
            const active = filterStatus === s;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? isAll
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : `${c!.bg} ${c!.color} ring-1 ${c!.ring}`
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {isAll ? 'All' : c!.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Cards grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLeads.map(lead => renderLeadCard(lead, sharedCardProps))}
      </div>

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {filteredLeads.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No leads found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={handleManualSubmit}
      />
    </div>
  );
}
