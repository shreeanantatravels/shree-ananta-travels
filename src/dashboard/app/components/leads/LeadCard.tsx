"use client";
/**
 * LeadCard.tsx
 *
 * Contains every piece of UI that makes up a single lead card:
 *   - CardWrapper   — highlight ring when navigated from Revenue page
 *   - CardHeader    — name, priority, status dropdown
 *   - RouteBlock    — dark From→To block with date / days / nights
 *   - CardActions   — Call + WhatsApp buttons
 *   - FormCard      — card layout for leads
 *   - renderLeadCard — single function to call from Leads.tsx
 */

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Users,
  IndianRupee,
  MessageSquare,
  AlarmClock,
  User,
  Sun,
  Moon,
  ArrowRightLeft,
  Package,
  Flame,
  Hotel,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import {
  Lead,
  PopupLead,
  FormLead,
  PackageLead,
} from "../../context/CRMContext";
import { useCRMContext } from "../../context/CRMContext";
import {
  STATUS_CONFIG,
  STATUS_HEADER,
  ALL_STATUSES,
  formatDate,
} from "./leadConfig";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CardWrapperProps {
  lead: Lead;
  highlightedId: string | number | null;
  cardRefs: React.MutableRefObject<Record<string | number, HTMLDivElement | null>>;
  children: React.ReactNode;
}

interface StatusDropdownProps {
  lead: Lead;
  openStatusDropdown: string | number | null;
  setOpenStatusDropdown: (id: string | number | null) => void;
  onStatusChange: (leadId: string | number, newStatus: string) => void;
}

// ── CardWrapper ────────────────────────────────────────────────────────────────

export function CardWrapper({
  lead,
  highlightedId,
  cardRefs,
  children,
}: CardWrapperProps) {
  const isHighlighted = highlightedId === lead.id;
  return (
    <div
      ref={(el) => {
        cardRefs.current[lead.id] = el;
      }}
      className={`transition-all duration-300 rounded-lg ${
        isHighlighted
          ? "ring-4 ring-indigo-400 ring-offset-2 shadow-xl shadow-indigo-200 scale-[1.02]"
          : ""
      }`}
    >
      {children}
    </div>
  );
}

// ── StatusDropdown ─────────────────────────────────────────────────────────────

export function StatusDropdown({
  lead,
  openStatusDropdown,
  setOpenStatusDropdown,
  onStatusChange,
}: StatusDropdownProps) {
  const { leadStatuses } = useCRMContext();
  const currentStatus = leadStatuses[lead.id];
  const c = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
  const SIcon = c.icon;
  const isOpen = openStatusDropdown === lead.id;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenStatusDropdown(isOpen ? null : lead.id);
        }}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ring-1 transition-colors ${c.bg} ${c.color} ${c.ring}`}
      >
        <SIcon className="w-2.5 h-2.5" />
        {c.label}
        <span className="ml-0.5 opacity-60">▾</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenStatusDropdown(null)}
          />
          <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl border border-gray-200 shadow-2xl z-50 overflow-hidden min-w-[140px]">
            <div className="px-3 py-1.5 border-b border-gray-100">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Set Status
              </p>
            </div>
            {ALL_STATUSES.map((s) => {
              const sc = STATUS_CONFIG[s];
              const SIcon = sc.icon;
              return (
                <button
                  key={s}
                  onClick={() => onStatusChange(lead.id, s)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors hover:bg-gray-50 ${
                    currentStatus === s
                      ? sc.bg + " " + sc.color
                      : "text-gray-700"
                  }`}
                >
                  <SIcon className={`w-3.5 h-3.5 flex-shrink-0 ${sc.color}`} />
                  {sc.label}
                  {currentStatus === s && (
                    <CheckCircle className="w-3 h-3 text-blue-500 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── CardHeader ─────────────────────────────────────────────────────────────────

export function CardHeader({
  lead,
  openStatusDropdown,
  setOpenStatusDropdown,
  onStatusChange,
}: StatusDropdownProps) {
  const { leadStatuses } = useCRMContext();
  const sh = STATUS_HEADER[leadStatuses[lead.id]] || STATUS_HEADER.pending;

  return (
    <div className={`p-2.5 border-b ${sh.headerBg} ${sh.headerBorder}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${sh.iconBg} ${sh.iconColor}`}
          >
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">
              {lead.name}
            </h3>
            {lead.priority === "high" && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-50 text-red-600 ring-1 ring-red-300 whitespace-nowrap">
                  <Flame className="w-2 h-2" /> High
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusDropdown
            lead={lead}
            openStatusDropdown={openStatusDropdown}
            setOpenStatusDropdown={setOpenStatusDropdown}
            onStatusChange={onStatusChange}
          />
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-400">
            <AlarmClock className="w-3 h-3" /> Enquired on {formatDate(lead.date)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── RouteBlock ─────────────────────────────────────────────────────────────────

interface RouteBlockProps {
  fromCity?: string;
  toCity: string;
  date?: string;
}

export function RouteBlock({
  fromCity,
  toCity,
  date,
}: RouteBlockProps) {
  return (
    <div className="bg-slate-900 rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1">
        {fromCity ? (
          <div className="flex-1 min-w-0">
            <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
              From
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="text-white font-bold text-xs truncate">
                {fromCity}
              </span>
            </div>
          </div>
        ) : null}
        {fromCity && (
          <div className="flex-shrink-0 mx-2">
            <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <ArrowRightLeft className="w-3 h-3 text-slate-300" />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
            Destination
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
            <span className="text-white font-bold text-xs truncate">
              {toCity || 'Not specified'}
            </span>
          </div>
        </div>
      </div>

      {date && (
        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] font-semibold text-amber-200">
            {date}
          </span>
        </div>
      )}
    </div>
  );
}

// ── CardActions ────────────────────────────────────────────────────────────────

export function CardActions({ phone }: { phone: string }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <a
        href={`tel:${phone}`}
        className="w-1/2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all duration-200"
      >
        <Phone className="w-3.5 h-3.5" /> Call
      </a>
      <a
        href={`https://wa.me/${phone.replace(/\D/g, "")}`}
        target="_blank"
        rel="noreferrer"
        className="w-1/2 flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-xs shadow-sm transition-all duration-200"
      >
        <FaWhatsapp style={{ width: 14, height: 14 }} /> WhatsApp
      </a>
    </div>
  );
}

// ── ContactBlock ───────────────────────────────────────────────────────────────

function ContactBlock({ phone, email }: { phone: string; email?: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
      <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2">
        Contact Details
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
            <Phone className="w-3 h-3 text-gray-600" />
          </div>
          <span className="text-xs font-semibold text-slate-800">{phone}</span>
        </div>
        {email && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <Mail className="w-3 h-3 text-gray-600" />
            </div>
            <span className="text-xs text-slate-500 truncate">{email}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const HOTEL_TYPE_LABELS: Record<string, string> = {
  '3-star': '3★ Comfort',
  '4-star': '4★ Premium',
  '5-star': '5★ Luxury',
  'resort': 'Resort / Villa',
};

// ── TravelersAndBudget ─────────────────────────────────────────────────────────

function TravelersAndBudget({
  travelers,
  budget,
}: {
  travelers?: number;
  budget?: string;
}) {
  if (!travelers && !budget) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {travelers ? (
        <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
              <Users className="w-3 h-3 text-purple-700" />
            </div>
            <span className="text-[9px] font-bold text-purple-800 uppercase tracking-wide">
              Travelers
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900">{travelers} pax</p>
        </div>
      ) : null}
      {budget ? (
        <div className="bg-green-50 rounded-lg p-2 border border-green-200">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
              <IndianRupee className="w-3 h-3 text-green-700" />
            </div>
            <span className="text-[9px] font-bold text-green-800 uppercase tracking-wide">
              Budget
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 truncate" title={budget}>{budget}</p>
        </div>
      ) : null}
    </div>
  );
}

// ── Shared card props ──────────────────────────────────────────────────────────

interface CardProps {
  lead: Lead;
  highlightedId: string | number | null;
  cardRefs: React.MutableRefObject<Record<string | number, HTMLDivElement | null>>;
  openStatusDropdown: string | number | null;
  setOpenStatusDropdown: (id: string | number | null) => void;
  onStatusChange: (leadId: string | number, newStatus: string) => void;
}

// ── LeadCard ───────────────────────────────────────────────────────────────────

export function LeadCard({
  lead,
  highlightedId,
  cardRefs,
  openStatusDropdown,
  setOpenStatusDropdown,
  onStatusChange,
}: CardProps) {
  const { leadStatuses } = useCRMContext();
  const sh = STATUS_HEADER[leadStatuses[lead.id]] || STATUS_HEADER.pending;
  const form = lead as FormLead;

  return (
    <CardWrapper lead={lead} highlightedId={highlightedId} cardRefs={cardRefs}>
      <div
        className={`flex flex-col bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${sh.cardBorder}`}
      >
        <CardHeader
          lead={lead}
          openStatusDropdown={openStatusDropdown}
          setOpenStatusDropdown={setOpenStatusDropdown}
          onStatusChange={onStatusChange}
        />

        <div className="p-2.5 space-y-2">
          <RouteBlock
            fromCity={form.fromCity}
            toCity={form.destination}
            date={form.startDate ? formatDate(form.startDate) : undefined}
          />

          <TravelersAndBudget travelers={form.travelers} budget={form.budget} />

          {(form.hotelBooked || form.hotelType) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs">
              <Hotel className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="font-bold text-[11px] truncate">
                {form.hotelBooked === "yes"
                  ? "Hotel: Already Booked"
                  : `Hotel: ${HOTEL_TYPE_LABELS[form.hotelType || ""] || form.hotelType || "Need Recommendations"}`}
              </span>
            </div>
          )}

          <ContactBlock phone={form.phone} email={form.email} />

          {form.message && (
            <div className="bg-rose-50 rounded-lg p-2 border border-rose-200">
              <div className="flex items-start gap-1.5">
                <div className="w-5 h-5 bg-rose-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare className="w-3 h-3 text-rose-700" />
                </div>
                <div>
                  <div className="text-[9px] font-bold text-rose-800 uppercase tracking-wide mb-0.5">
                    Note
                  </div>
                  <p className="text-xs text-slate-700 leading-snug line-clamp-2">
                    {form.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto px-2.5 pb-2.5">
          <CardActions phone={form.phone} />
        </div>
      </div>
    </CardWrapper>
  );
}

export function renderLeadCard(
  lead: Lead,
  sharedProps: Omit<CardProps, "lead">,
) {
  return <LeadCard key={lead.id} lead={lead} {...sharedProps} />;
}
