"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  MessageSquare,
  Hotel,
  Plane,
  CheckCircle2,
  DollarSign,
  Clock,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Compass,
  Star,
  Shield,
  Tag,
} from "lucide-react";
import { useAgent } from "../context/AgentContext";
import { toast } from "sonner";

// ── Shared sub-components ───────────────────────────────

interface FormFieldProps {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  required?: boolean;
  tooltip?: string;
}

const FormField = ({
  label,
  icon: Icon,
  children,
  required,
  tooltip,
}: FormFieldProps) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
      {Icon && <Icon className="h-3.5 w-3.5 text-[var(--theme-primary)]" />}
      <span>{label}</span>
      {required && <span className="text-red-500 font-black">*</span>}
      {tooltip && (
        <span className="text-[11px] text-gray-400 font-normal capitalize">
          ({tooltip})
        </span>
      )}
    </label>
    {children}
  </div>
);

interface ProgressStepProps {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
  icon: React.ElementType;
}

const ProgressStep = ({
  number,
  label,
  active,
  completed,
  icon: StepIcon,
}: ProgressStepProps) => (
  <div className="flex flex-col items-center gap-1.5 relative z-10">
    <div
      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-300 ${
        completed
          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 scale-100"
          : active
            ? "bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white shadow-xl shadow-[var(--theme-primary)]/30 scale-110 ring-4 ring-[var(--theme-primary)]/20"
            : "bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700"
      }`}
    >
      {completed ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <StepIcon className="w-4 h-4" />
      )}
    </div>
    <span
      className={`text-[11px] font-bold tracking-tight transition-colors hidden sm:block ${
        active
          ? "text-[var(--theme-primary)] dark:text-white font-extrabold"
          : completed
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-gray-400"
      }`}
    >
      {label}
    </span>
  </div>
);

const inputWrapperClass =
  "relative flex items-center rounded-2xl bg-gray-50/70 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 focus-within:border-[var(--theme-primary)] focus-within:ring-4 focus-within:ring-[var(--theme-primary)]/15 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all duration-200 shadow-xs group";
const inputInsideClass =
  "w-full px-3.5 py-3.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm font-medium focus:outline-none";

// ── Types ───────────────────────────────────────────────

export interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  numberOfDays: string;
  hotelBooked: string;
  hotelType: string;
  budgetRupees: string;
  adults: number;
  children: number;
  ticketsBooked: string;
  ticketFlight: boolean;
  ticketTrain: boolean;
  ticketBus: boolean;
  specialRequests: string;
  formFillTime: number;
}

export interface EnquiryFormProps {
  prefilledDestination?: string;
  prefilledPackageName?: string;
  prefilledDuration?: string;
  lockDestination?: boolean;
  onSubmitSuccess?: () => void;
  compact?: boolean;
  hideHeader?: boolean;
  source?: string;
}

const initialFormData: EnquiryFormData = {
  name: "",
  email: "",
  phone: "",
  fromLocation: "",
  toLocation: "",
  departureDate: "",
  numberOfDays: "",
  hotelBooked: "no",
  hotelType: "",
  budgetRupees: "",
  adults: 1,
  children: 0,
  ticketsBooked: "no",
  ticketFlight: false,
  ticketTrain: false,
  ticketBus: false,
  specialRequests: "",
  formFillTime: 0,
};

const budgetOptions = [
  { value: "Under ₹10,000", label: "Under ₹10k", tag: "Budget Friendly" },
  { value: "₹10,000 - ₹25,000", label: "₹10k - ₹25k", tag: "Popular Choice" },
  { value: "₹25,000 - ₹50,000", label: "₹25k - ₹50k", tag: "Comfort Plus" },
  {
    value: "₹50,000 - ₹1,00,000",
    label: "₹50k - ₹1 Lakh",
    tag: "Luxury Experience",
  },
  { value: "Above ₹1,00,000", label: "Above ₹1 Lakh", tag: "VIP Custom" },
];

const hotelCategoryOptions = [
  { value: "3-star", label: "3★ Comfort", desc: "Clean, cozy & modern" },
  { value: "4-star", label: "4★ Premium", desc: "Top amenities & location" },
  { value: "5-star", label: "5★ Luxury", desc: "World-class hospitality" },
  { value: "resort", label: "Resort / Villa", desc: "Private & scenic stays" },
];

const quickTags = [
  "Honeymoon Special",
  "Pure Veg Meals",
  "Airport Transfers Needed",
  "Private Cab Only",
  "Senior Friendly",
  "Kid Friendly",
];

export function EnquiryForm({
  prefilledDestination = "",
  prefilledPackageName = "",
  prefilledDuration = "",
  lockDestination = false,
  onSubmitSuccess,
  compact = false,
  hideHeader = false,
}: EnquiryFormProps) {
  const { siteConfig } = useAgent();
  const [startTime] = useState(Date.now());
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EnquiryFormData>({
    ...initialFormData,
    toLocation: prefilledDestination,
    numberOfDays: prefilledDuration,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFormData((prev) => ({
        ...prev,
        formFillTime: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, type } = e.target;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addQuickTag = (tag: string) => {
    setFormData((prev) => {
      const existing = prev.specialRequests ? prev.specialRequests.trim() : "";
      if (existing.includes(tag)) return prev;
      return {
        ...prev,
        specialRequests: existing ? `${existing}, ${tag}` : tag,
      };
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: {
        if (!formData.name || !formData.email || !formData.phone) return false;
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        if (!emailOk) {
          toast.error("Please enter a valid email address");
          return false;
        }
        return true;
      }
      case 2:
        return !!(
          formData.fromLocation &&
          formData.toLocation &&
          formData.departureDate &&
          formData.numberOfDays
        );
      case 3:
        return !!formData.budgetRupees;
      default:
        return true;
    }
  };

  const handleNextStep = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict Guard: Never submit to backend unless on Step 4
    if (currentStep < 4) {
      handleNextStep(e);
      return;
    }

    if (currentStep !== 4 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let parsedBudget: any = formData.budgetRupees;
      if (
        typeof formData.budgetRupees === "string" &&
        formData.budgetRupees.trim() !== ""
      ) {
        const digits = formData.budgetRupees.replace(/,/g, "").match(/\d+/g);
        if (digits && digits.length > 0) {
          parsedBudget =
            digits.length >= 2
              ? Math.round((Number(digits[0]) + Number(digits[1])) / 2)
              : Number(digits[0]);
        }
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          budgetRupees: parsedBudget,
          ...(prefilledPackageName
            ? { packageName: prefilledPackageName }
            : {}),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        toast.success("Enquiry submitted successfully!");
      } else {
        toast.error(data.message || "Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setTimeout(() => {
      setCurrentStep(1);
      setFormData({
        ...initialFormData,
        toLocation: prefilledDestination,
        numberOfDays: prefilledDuration,
      });
      onSubmitSuccess?.();
    }, 500);
  };

  const steps = [
    { number: 1, label: "Your Info", icon: User },
    { number: 2, label: "Travel Plan", icon: Compass },
    { number: 3, label: "Preferences", icon: DollarSign },
    { number: 4, label: "Details", icon: MessageSquare },
  ];

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <FormField label="Full Name" icon={User} required>
              <div className={inputWrapperClass}>
                <div className="pl-3.5 text-gray-400 group-focus-within:text-[var(--theme-primary)] transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  name="name"
                  className={inputInsideClass}
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </FormField>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Phone Number" icon={Phone} required>
                <div className={inputWrapperClass}>
                  <div className="pl-3.5 text-gray-400 group-focus-within:text-[var(--theme-primary)] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    className={inputInsideClass}
                    onChange={handleChange}
                    value={formData.phone}
                    placeholder="e.g. +91 98765 43210"
                    required
                  />
                </div>
              </FormField>

              <FormField label="Email Address" icon={Mail} required>
                <div className={inputWrapperClass}>
                  <div className="pl-3.5 text-gray-400 group-focus-within:text-[var(--theme-primary)] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    className={inputInsideClass}
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </FormField>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Departure City" icon={MapPin} required>
                <div className={inputWrapperClass}>
                  <div className="pl-3.5 text-gray-400 group-focus-within:text-[var(--theme-primary)] transition-colors">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                  </div>
                  <input
                    name="fromLocation"
                    className={inputInsideClass}
                    onChange={handleChange}
                    value={formData.fromLocation}
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    required
                  />
                </div>
              </FormField>

              <FormField label="Destination" icon={Compass} required>
                {lockDestination ? (
                  <div className="flex items-center gap-2 px-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-100/80 dark:bg-gray-800 text-sm">
                    <Compass className="w-4 h-4 text-[var(--theme-primary)]" />
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formData.toLocation}
                    </span>
                    {prefilledPackageName && (
                      <span className="text-xs text-gray-500 ml-auto font-medium truncate">
                        ({prefilledPackageName})
                      </span>
                    )}
                  </div>
                ) : (
                  <div className={inputWrapperClass}>
                    <div className="pl-3.5 text-gray-400 group-focus-within:text-[var(--theme-primary)] transition-colors">
                      <Compass className="w-4 h-4 text-[var(--theme-primary)]" />
                    </div>
                    <input
                      name="toLocation"
                      className={inputInsideClass}
                      onChange={handleChange}
                      value={formData.toLocation}
                      placeholder="e.g. Goa, Bali, Kashmir, Dubai"
                      required
                    />
                  </div>
                )}
              </FormField>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Travel Date" icon={Calendar} required>
                <div className={inputWrapperClass}>
                  <div className="pl-3.5 text-gray-400 group-focus-within:text-[var(--theme-primary)] transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    name="departureDate"
                    className={inputInsideClass}
                    onChange={handleChange}
                    value={formData.departureDate}
                    required
                  />
                </div>
              </FormField>

              <FormField label="Duration (Days)" icon={Clock} required>
                <div className={inputWrapperClass}>
                  <div className="pl-3.5 text-gray-400 group-focus-within:text-[var(--theme-primary)] transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    name="numberOfDays"
                    min="1"
                    max="60"
                    className={inputInsideClass}
                    onChange={handleChange}
                    value={formData.numberOfDays}
                    placeholder="Number of days (e.g. 5)"
                    required
                  />
                </div>
              </FormField>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Adults (12+ yrs)" icon={Users} required>
                <div className={inputWrapperClass}>
                  <div className="pl-3.5 text-gray-400 group-focus-within:text-[var(--theme-primary)] transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    name="adults"
                    min="1"
                    max="50"
                    className={inputInsideClass}
                    onChange={handleChange}
                    value={formData.adults}
                    required
                  />
                </div>
              </FormField>

              <FormField label="Children (2-12 yrs)">
                <div className={inputWrapperClass}>
                  <div className="pl-3.5 text-gray-400 group-focus-within:text-[var(--theme-primary)] transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    name="children"
                    min="0"
                    max="20"
                    className={inputInsideClass}
                    onChange={handleChange}
                    value={formData.children}
                  />
                </div>
              </FormField>
            </div>

            <FormField
              label="Approx. Budget per person (₹)"
              icon={DollarSign}
              required
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {budgetOptions.map((opt) => {
                  const selected = formData.budgetRupees === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          budgetRupees: opt.value,
                        }))
                      }
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
                        selected
                          ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 shadow-sm ring-2 ring-[var(--theme-primary)]/30"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="text-xs font-black text-gray-900 dark:text-white flex items-center justify-between">
                        <span>{opt.label}</span>
                        {selected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                        {opt.tag}
                      </div>
                    </button>
                  );
                })}
              </div>
            </FormField>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Hotel Accommodation" icon={Hotel}>
                <div className={inputWrapperClass}>
                  <div className="pl-3.5 text-gray-400">
                    <Hotel className="w-4 h-4" />
                  </div>
                  <select
                    name="hotelBooked"
                    className={`${inputInsideClass} cursor-pointer`}
                    onChange={handleChange}
                    value={formData.hotelBooked}
                  >
                    <option value="no">Need hotel recommendations</option>
                    <option value="yes">Already booked hotel</option>
                  </select>
                </div>
              </FormField>

              <FormField label="Hotel Category Preference">
                <div className="grid grid-cols-2 gap-2">
                  {hotelCategoryOptions.map((hc) => {
                    const selected = formData.hotelType === hc.value;
                    return (
                      <button
                        key={hc.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            hotelType: hc.value,
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                          selected
                            ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 ring-2 ring-[var(--theme-primary)]/30"
                            : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center justify-between">
                          <span>{hc.label}</span>
                          {selected && (
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </FormField>
            </div>

            <FormField
              label="Special Requests / Customizations"
              icon={MessageSquare}
            >
              <div className="space-y-2.5">
                <div className={inputWrapperClass}>
                  <textarea
                    name="specialRequests"
                    rows={3}
                    className={`${inputInsideClass} py-3 resize-none`}
                    onChange={handleChange}
                    value={formData.specialRequests}
                    placeholder="Tell us about food preferences, flight requirements, sightseeing options, or any special occasions..."
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <Tag className="w-3 h-3 text-[var(--theme-primary)]" />{" "}
                    Quick Add Preferences:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addQuickTag(tag)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-[var(--theme-primary)]/15 hover:text-[var(--theme-primary)] text-gray-600 dark:text-gray-300 rounded-lg transition-all cursor-pointer border border-gray-200/60 dark:border-gray-700/60"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </FormField>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`${compact ? "" : "max-w-4xl mx-auto px-4 py-6 sm:py-10"}`}
      >
        {!hideHeader && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--theme-primary)]/10 to-[var(--theme-secondary)]/10 text-[var(--theme-primary)] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-[var(--theme-primary)]/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> Fast 60-Second Quote
            </div>
            <h2
              className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Plan Your Dream Vacation
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium max-w-lg mx-auto">
              Get personalized itineraries and best price quotes from our travel
              experts within 2 hours.
            </p>
          </div>
        )}

        <div className={compact ? "w-full" : "bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden backdrop-blur-xl transition-all"}>
          {/* Progress Step Header with animated line */}
          <div className="bg-gray-50/90 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 px-6 py-5">
            <div className="flex justify-between items-center max-w-md mx-auto relative">
              {/* Background connector line */}
              <div className="absolute top-5 left-4 right-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full -z-0" />
              {/* Active progress fill line */}
              <div
                className="absolute top-5 left-4 h-1 bg-gradient-to-r from-[var(--theme-primary)] to-emerald-500 rounded-full transition-all duration-500 -z-0"
                style={{ width: `calc(${progressPercent}% * 0.9)` }}
              />

              {steps.map((s) => (
                <ProgressStep
                  key={s.number}
                  number={s.number}
                  label={s.label}
                  icon={s.icon}
                  active={currentStep === s.number}
                  completed={currentStep > s.number}
                />
              ))}
            </div>
          </div>

          <div className={compact ? "p-5 sm:p-7" : "p-6 sm:p-8"}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStep()}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="px-5 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto px-8 py-3.5 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto px-9 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Request</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Trust badges footer */}
          <div className="bg-gray-50/60 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800/80 px-6 py-3 flex flex-wrap items-center justify-around gap-4 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Free
              Consultation
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--theme-primary)]" /> Fast
              2-hr Quotes
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{" "}
              Best Price Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[10000] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3
              className="text-2xl font-black text-gray-900 dark:text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Request Sent Successfully!
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Thank you! We will review your request and call you within 2 hours
              to discuss your custom travel plan.
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
