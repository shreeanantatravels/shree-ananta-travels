"use client";
import {
  Clock, PhoneCall, MessageSquare, IndianRupee,
  CheckCircle, XCircle,
} from 'lucide-react';
import { LeadStatus } from '../../context/CRMContext';

// ── Status config ──────────────────────────────────────────────────────────────
export const STATUS_CONFIG: Record<string, {
  label: string;
  icon: any;
  color: string;
  bg: string;
  ring: string;
  border: string;
}> = {
  pending:   { label: 'Pending',   icon: Clock,         color: 'text-orange-700', bg: 'bg-orange-50',  ring: 'ring-orange-400/40', border: 'border-orange-300' },
  contacted: { label: 'Contacted', icon: PhoneCall,      color: 'text-blue-700',   bg: 'bg-blue-50',    ring: 'ring-blue-400/40',   border: 'border-blue-300'   },
  follow_up: { label: 'Follow Up', icon: MessageSquare,  color: 'text-purple-700', bg: 'bg-purple-50',  ring: 'ring-purple-400/40', border: 'border-purple-300' },
  quoted:    { label: 'Quoted',    icon: IndianRupee,    color: 'text-indigo-700', bg: 'bg-indigo-50',  ring: 'ring-indigo-400/40', border: 'border-indigo-300' },
  cancelled: { label: 'Cancelled', icon: XCircle,        color: 'text-red-700',    bg: 'bg-red-50',     ring: 'ring-red-400/40',    border: 'border-red-300'    },
};

// ── Card header styles (driven by status) ─────────────────────────────────────
export const STATUS_HEADER: Record<string, {
  headerBg: string;
  headerBorder: string;
  iconBg: string;
  iconColor: string;
  cardBorder: string;
}> = {
  pending:   { headerBg: 'bg-orange-50/70', headerBorder: 'border-orange-100', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', cardBorder: 'border-orange-300' },
  contacted: { headerBg: 'bg-blue-50/70',   headerBorder: 'border-blue-100',   iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   cardBorder: 'border-blue-300'   },
  follow_up: { headerBg: 'bg-purple-50/70', headerBorder: 'border-purple-100', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', cardBorder: 'border-purple-300' },
  quoted:    { headerBg: 'bg-indigo-50/70', headerBorder: 'border-indigo-100', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', cardBorder: 'border-indigo-300' },
  cancelled: { headerBg: 'bg-red-50/70',    headerBorder: 'border-red-100',    iconBg: 'bg-red-100',    iconColor: 'text-red-600',    cardBorder: 'border-red-300'    },
};

export const ALL_STATUSES = Object.keys(STATUS_CONFIG) as LeadStatus[];

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}
