"use client";
import { 
  X, Tag, Award, TrendingUp, Plus, Trash2, Calendar, CheckCircle2, XCircle, 
  Loader2, Sparkles, Link as LinkIcon, AlertCircle, Check,
  ArrowUp, ArrowDown, ChevronDown, ChevronUp, MapPin, Utensils, Bed, Bus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCreatePackageMutation, useUpdatePackageMutation, PackageData } from '../api/packageApi';
import { toast } from 'sonner';
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { TagEntryField } from './package/TagEntryField';
import { CustomCategoryModal } from './package/CustomCategoryModal';
import { ImageUploadSlot } from './package/ImageUploadSlot';
import { PackageTagsSection } from './package/PackageTagsSection';
import { PackageSeoSection } from './package/PackageSeoSection';
import { slugifyPackage } from '@/lib/utils/packageSeoHelper';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PackageData;
}

interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  route?: string;
  altitude?: string;
  stay?: string;
  meals?: string;
  transport?: string;
  isCollapsed?: boolean;
}

export function PackageModal({ isOpen, onClose, initialData }: PackageModalProps) {
  const isEditMode = !!initialData;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugSuggested, setSlugSuggested] = useState<string | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('domestic');
  const [description, setDescription] = useState('');

  // Dynamic Route & Style Fields
  const [route, setRoute] = useState('');
  const [departure, setDeparture] = useState('');
  const [tourStyle, setTourStyle] = useState('');
  const [routeBannerTitle, setRouteBannerTitle] = useState('');
  const [routeBannerSubtitle, setRouteBannerSubtitle] = useState('');

  const [originalPrice, setOriginalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [priceType, setPriceType] = useState<'fixed' | 'onRequest'>('fixed');
  
  // Single Bestseller badge
  const [isBestseller, setIsBestseller] = useState(false);

  const [hasOffer, setHasOffer] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([]);
  const [imagePreviews, setImagePreviews] = useState<[string | null, string | null, string | null, string | null]>([null, null, null, null]);
  const [imageFiles, setImageFiles] = useState<[File | null, File | null, File | null, File | null]>([null, null, null, null]);

  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const isSaving = isCreating || isUpdating;

  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [termsAndConditions, setTermsAndConditions] = useState<string[]>([]);

  // Tags & SEO
  const [tags, setTags] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);

  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);

  // Check slug availability via API
  const checkSlugAvailability = async (slugToCheck: string) => {
    const clean = slugifyPackage(slugToCheck);
    if (!clean) {
      setSlugError('URL Slug cannot be empty.');
      setSlugSuggested(null);
      return;
    }
    try {
      setIsCheckingSlug(true);
      const url = `/api/packages/check-slug?slug=${encodeURIComponent(clean)}${
        initialData?._id ? `&excludeId=${initialData._id}` : ''
      }`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.available) {
        setSlugError(data.message || 'This slug is already in use.');
        setSlugSuggested(data.suggestedSlug || null);
      } else {
        setSlugError(null);
        setSlugSuggested(null);
      }
    } catch {
      // graceful fallback
    } finally {
      setIsCheckingSlug(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setIsSlugManuallyEdited(!!initialData.slug);
      setSlugError(null);
      setSlugSuggested(null);

      setLocation(initialData.location || '');
      setDuration(initialData.duration || '');
      setCategory(initialData.category || 'domestic');
      setDescription(initialData.description || '');
      
      const hasValidPrice = !!((initialData.originalPrice && initialData.originalPrice > 0) || (initialData.discountedPrice && initialData.discountedPrice > 0));
      setPriceType(hasValidPrice ? 'fixed' : 'onRequest');
      setOriginalPrice(hasValidPrice && initialData.originalPrice ? initialData.originalPrice.toString() : '');
      setDiscountedPrice(hasValidPrice && initialData.discountedPrice ? initialData.discountedPrice.toString() : '');
      
      setIsBestseller(initialData.badges?.includes('bestseller') || false);
      
      setHasOffer(initialData.hasOffer || false);
      setIsTrending(initialData.isTrending || false);
      const parseArrayField = (field: any): string[] => {
        if (!field) return [];
        if (Array.isArray(field)) return field.map(String).filter(Boolean);
        if (typeof field === 'string') {
          const trimmed = field.trim();
          if (!trimmed) return [];
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
          } catch {
            // not JSON
          }
          return [trimmed];
        }
        return [];
      };

      setInclusions(parseArrayField(initialData.inclusions));
      setExclusions(parseArrayField(initialData.exclusions));
      setTermsAndConditions(parseArrayField(initialData.termsAndConditions));
      
      const pkgType = initialData.packageType || '';
      if (pkgType && !['pilgrimage', 'beach', 'mountain', 'honeymoon'].includes(pkgType)) {
        setCustomTypes(prev => (prev.includes(pkgType) ? prev : [...prev, pkgType]));
      }
      setSelectedType(pkgType);

      // Route and style highlights
      setRoute(initialData.route || '');
      setDeparture(initialData.departure || '');
      setTourStyle(initialData.tourStyle || '');
      setRouteBannerTitle(initialData.routeBannerTitle || '');
      setRouteBannerSubtitle(initialData.routeBannerSubtitle || '');

      setTags(parseArrayField(initialData.tags));
      setSeoTitle(initialData.seo?.title || '');
      setSeoDescription(initialData.seo?.description || '');
      setFocusKeyword(initialData.seo?.focusKeyword || '');
      setRelatedKeywords(parseArrayField(initialData.seo?.relatedKeywords));

      setItineraryDays(
        (initialData.itinerary || []).map((d: any, i) => ({
          id: d._id || String(i),
          dayNumber: d.dayNumber ?? (i + 1),
          title: d.title || '',
          description: d.description || '',
          route: d.route || '',
          altitude: d.altitude || '',
          stay: d.stay || '',
          meals: d.meals || '',
          transport: d.transport || '',
          isCollapsed: false,
        }))
      );
      setImagePreviews([
        initialData.imageUrl1 || null,
        initialData.imageUrl2 || null,
        initialData.imageUrl3 || null,
        initialData.imageUrl4 || null,
      ]);
      setImageFiles([null, null, null, null]);
    } else {
      setTitle('');
      setSlug('');
      setIsSlugManuallyEdited(false);
      setSlugError(null);
      setSlugSuggested(null);

      setLocation(''); setDuration('');
      setCategory('domestic'); setDescription('');
      setRoute(''); setDeparture(''); setTourStyle(''); setRouteBannerTitle(''); setRouteBannerSubtitle('');
      setPriceType('fixed');
      setOriginalPrice(''); setDiscountedPrice('');
      setIsBestseller(false); setHasOffer(false); setIsTrending(false);
      setInclusions([]); setExclusions([]); setTermsAndConditions([]); setSelectedType('');
      setTags([]);
      setSeoTitle(''); setSeoDescription(''); setFocusKeyword(''); setRelatedKeywords([]);
      setItineraryDays([]);
      setImagePreviews([null, null, null, null]); setImageFiles([null, null, null, null]);
    }
  }, [isOpen, initialData]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isSlugManuallyEdited) {
      const generated = slugifyPackage(newTitle);
      setSlug(generated);
      if (generated) {
        checkSlugAvailability(generated);
      } else {
        setSlugError(null);
        setSlugSuggested(null);
      }
    }
  };

  const handleGenerateSlugClick = () => {
    const generated = slugifyPackage(title || 'package');
    setSlug(generated);
    setIsSlugManuallyEdited(false);
    checkSlugAvailability(generated);
  };

  const handleSlugBlur = () => {
    const cleaned = slugifyPackage(slug);
    setSlug(cleaned);
    if (cleaned) {
      checkSlugAvailability(cleaned);
    }
  };

  const handleApplySuggestedSlug = (suggested: string) => {
    setSlug(suggested);
    setSlugError(null);
    setSlugSuggested(null);
    setIsSlugManuallyEdited(true);
  };

  const setPreview = (index: 0 | 1 | 2 | 3, src: string | null) =>
    setImagePreviews(prev => { 
      const next: [string | null, string | null, string | null, string | null] = [...prev] as [string | null, string | null, string | null, string | null]; 
      next[index] = src; 
      return next; 
    });

  const handleImageFile = (index: 0 | 1 | 2 | 3, file: File) => {
    setImageFiles(prev => {
      const next: [File | null, File | null, File | null, File | null] = [...prev] as [File | null, File | null, File | null, File | null];
      next[index] = file;
      return next;
    })
    const reader = new FileReader();
    reader.onload = e => setPreview(index, e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const calculateDiscount = () => {
    const origStr = String(originalPrice || '').replace(/[^0-9.]/g, '');
    const discStr = String(discountedPrice || '').replace(/[^0-9.]/g, '');
    const original = parseFloat(origStr);
    const discounted = parseFloat(discStr);
    if (original && discounted && original > discounted)
      return ((original - discounted) / original * 100).toFixed(0);
    return '0';
  };

  const addItineraryDay = () =>
    setItineraryDays(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        dayNumber: prev.length + 1,
        title: '',
        description: '• ',
        route: '',
        altitude: '',
        stay: '',
        meals: '',
        transport: '',
        isCollapsed: false,
      },
    ]);

  const moveDay = (index: number, direction: 'up' | 'down') => {
    setItineraryDays(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next.map((day, idx) => ({ ...day, dayNumber: idx + 1 }));
    });
  };

  const removeDay = (dayId: string) => {
    setItineraryDays(prev => {
      const filtered = prev.filter(d => d.id !== dayId);
      return filtered.map((day, idx) => ({ ...day, dayNumber: idx + 1 }));
    });
  };

  const toggleDayCollapse = (dayId: string) => {
    setItineraryDays(prev =>
      prev.map(d => (d.id === dayId ? { ...d, isCollapsed: !d.isCollapsed } : d))
    );
  };

  const expandAllItinerary = () => {
    setItineraryDays(prev => prev.map(d => ({ ...d, isCollapsed: false })));
  };

  const collapseAllItinerary = () => {
    setItineraryDays(prev => prev.map(d => ({ ...d, isCollapsed: true })));
  };

  const handleItineraryKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, dayId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      // Automatically add a newline with a bullet prefix
      const nextBullet = '\n• ';
      const updated = val.substring(0, start) + nextBullet + val.substring(end);

      setItineraryDays(prev =>
        prev.map(d => (d.id === dayId ? { ...d, description: updated } : d))
      );

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + nextBullet.length;
      }, 0);
    }
  };

  const handleItineraryFocus = (dayId: string, currentVal: string) => {
    if (!currentVal || currentVal.trim() === '') {
      setItineraryDays(prev =>
        prev.map(d => (d.id === dayId ? { ...d, description: '• ' } : d))
      );
    }
  };

  const addBulletToDay = (dayId: string) => {
    setItineraryDays(prev =>
      prev.map(d => {
        if (d.id !== dayId) return d;
        const val = d.description ? d.description.trimEnd() : '';
        const updated = val ? `${val}\n• ` : '• ';
        return { ...d, description: updated };
      })
    );
  };

  const autoFormatToBullets = (dayId: string, currentVal: string) => {
    if (!currentVal || !currentVal.trim()) {
      setItineraryDays(prev =>
        prev.map(d => (d.id === dayId ? { ...d, description: '• ' } : d))
      );
      return;
    }

    let parts = currentVal.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // If it's a single paragraph with periods (sentences), split by sentence
    if (parts.length === 1 && parts[0].includes('. ')) {
      parts = parts[0].split(/(?<=\.)\s+/).map(l => l.trim()).filter(Boolean);
    }

    const formatted = parts
      .map(part => {
        const clean = part.replace(/^([•\-\*]|\d+[\.\)])\s*/, '').trim();
        return `• ${clean}`;
      })
      .join('\n');

    setItineraryDays(prev =>
      prev.map(d => (d.id === dayId ? { ...d, description: formatted } : d))
    );
    toast.success('Day details formatted into bullet points!');
  };

  const handleCreate = async () => {
    if (!title || !location || !duration || !description) {
      toast.error('Please fill all critical required fields (Name, Destination, Duration, Description)');
      return;
    }

    const cleanSlug = slugifyPackage(slug || title);
    if (!cleanSlug) {
      toast.error('Please specify or generate a valid URL slug');
      return;
    }

    if (slugError) {
      toast.error('Please resolve the URL slug error before saving');
      return;
    }
    
    try {
      const origAmt = priceType === 'fixed' && originalPrice ? (parseFloat(String(originalPrice).replace(/[^0-9.]/g, '')) || 0) : 0;
      const discAmt = priceType === 'fixed' && discountedPrice ? (parseFloat(String(discountedPrice).replace(/[^0-9.]/g, '')) || 0) : 0;

      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', cleanSlug);
      formData.append('location', location);
      formData.append('duration', duration);
      formData.append('category', category);
      formData.append('packageType', selectedType || 'other');
      formData.append('description', description);
      formData.append('route', route);
      formData.append('departure', departure);
      formData.append('tourStyle', tourStyle);
      formData.append('routeBannerTitle', routeBannerTitle);
      formData.append('routeBannerSubtitle', routeBannerSubtitle);
      formData.append('originalPrice', origAmt.toString());
      formData.append('discountedPrice', discAmt.toString());
      formData.append('isTrending', String(isTrending));
      formData.append('hasOffer', String(hasOffer));
      
      // Save only bestseller if checked
      formData.append('badges', JSON.stringify(isBestseller ? ['bestseller'] : []));
      
      formData.append('inclusions', JSON.stringify(inclusions));
      formData.append('exclusions', JSON.stringify(exclusions));
      formData.append('termsAndConditions', JSON.stringify(termsAndConditions));
      formData.append('tags', JSON.stringify(tags));
      formData.append(
        'seo',
        JSON.stringify({
          title: seoTitle,
          description: seoDescription,
          focusKeyword,
          relatedKeywords,
        })
      );
      formData.append('itinerary', JSON.stringify(itineraryDays.map((d, idx) => ({
        dayNumber: idx + 1,
        title: d.title || `Day ${idx + 1}`,
        description: d.description || '',
        route: d.route || '',
        altitude: d.altitude || '',
        stay: d.stay || '',
        meals: d.meals || '',
        transport: d.transport || '',
      }))));
      formData.append('isActive', 'true');

      if (imageFiles[0]) formData.append('image1', imageFiles[0]);
      else formData.append('imageUrl1', imagePreviews[0] || '');

      if (imageFiles[1]) formData.append('image2', imageFiles[1]);
      else formData.append('imageUrl2', imagePreviews[1] || '');

      if (imageFiles[2]) formData.append('image3', imageFiles[2]);
      else formData.append('imageUrl3', imagePreviews[2] || '');

      if (imageFiles[3]) formData.append('image4', imageFiles[3]);
      else formData.append('imageUrl4', imagePreviews[3] || '');

      if (isEditMode && initialData._id) {
        await updatePackage({ id: initialData._id, data: formData }).unwrap();
        toast.success('Package updated successfully!');
      } else {
        await createPackage(formData).unwrap();
        toast.success('Package created successfully!');
      }
      onClose();
    } catch (e: any) {
      toast.error(e.data?.message || (isEditMode ? 'Failed to update package' : 'Failed to create package'));
    }
  };

  if (!isOpen) return null;

  const discountPercentage = calculateDiscount();
  const inp = 'w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {isEditMode ? '✏️ Edit Package' : 'Add New Package'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isEditMode ? 'Update the details of this travel package' : 'Fill in the details to create a new travel package'}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex-1 space-y-5">
            {/* Basic Details */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-3 min-w-0">
                {/* 1. Package Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Package Name</label>
                  <Input
                    value={title}
                    onChange={e => handleTitleChange(e.target.value)}
                    type="text"
                    placeholder="e.g., Do Dham Yatra by Helicopter"
                    className={inp + " h-auto"}
                  />
                </div>

                {/* 2. URL Slug with Generate Slug Button & Live Preview */}
                <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700">
                      URL Slug
                      <span className="text-[10px] font-normal text-gray-400 ml-1.5">(SEO Friendly)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateSlugClick}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      Generate Slug
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      value={slug}
                      onChange={e => {
                        setIsSlugManuallyEdited(true);
                        setSlug(e.target.value);
                      }}
                      onBlur={handleSlugBlur}
                      type="text"
                      placeholder="e.g., do-dham-yatra-by-helicopter"
                      className={`w-full px-3 py-2 text-sm bg-white border rounded focus:ring-2 focus:ring-blue-500 transition-all font-mono text-xs ${
                        slugError ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                      }`}
                    />
                    {isCheckingSlug && (
                      <span className="absolute right-3 top-2.5 text-[10px] text-gray-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> checking...
                      </span>
                    )}
                  </div>

                  {/* Slug Error & Suggested Alternative */}
                  {slugError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 text-red-500 flex-shrink-0" />
                        <span>{slugError}</span>
                      </div>
                      {slugSuggested && (
                        <button
                          type="button"
                          onClick={() => handleApplySuggestedSlug(slugSuggested)}
                          className="text-[11px] font-bold text-red-800 underline hover:text-red-900 whitespace-nowrap cursor-pointer"
                        >
                          Use "{slugSuggested}"
                        </button>
                      )}
                    </div>
                  )}

                  {/* Live URL Preview */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate pt-0.5 font-mono">
                    <LinkIcon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-400">Live URL:</span>
                    <span className="text-blue-700 truncate underline">
                      https://www.shreeanantatravels.com/packages/{slug || 'your-package-slug'}
                    </span>
                  </div>
                </div>

                {/* 3. Destination, Duration, Category, Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Destination</label>
                  <Input value={location} onChange={e => setLocation(e.target.value)} type="text" placeholder="e.g., Tibet, China / Nepal" className={inp + " h-auto"} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                  <Input value={duration} onChange={e => setDuration(e.target.value)} type="text" placeholder="e.g., 14 Days / 13 Nights" className={inp + " h-auto"} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className={inp + ' font-medium h-[42px]'}>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="z-[99999] bg-white dark:bg-gray-900 shadow-2xl p-1 rounded-xl border border-gray-200 dark:border-gray-800">
                        <SelectItem value="domestic">Domestic</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                        <SelectItem value="kailash">Kailash Mansarovar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                    <Select value={selectedType}
                      onValueChange={val => { if (val === '__custom__') { setShowTypeModal(true); } else { setSelectedType(val); } }}>
                      <SelectTrigger className={inp + ' font-medium h-[42px]'}>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent className="z-[99999] bg-white dark:bg-gray-900 shadow-2xl p-1 rounded-xl border border-gray-200 dark:border-gray-800">
                        <SelectItem value="pilgrimage">Pilgrimage / Yatra</SelectItem>
                        <SelectItem value="beach">Beach</SelectItem>
                        <SelectItem value="mountain">Mountain</SelectItem>
                        <SelectItem value="honeymoon">Honeymoon</SelectItem>
                        {customTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        <SelectItem value="__custom__" className="text-blue-600 font-semibold">+ Add Custom…</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Image Slots */}
              <div className="w-[420px] flex-shrink-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-gray-700">Images (4 Slots)</span>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    WebP Only
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ImageUploadSlot label="Main Image *" preview={imagePreviews[0]} onFile={f => handleImageFile(0, f)} onClear={() => setPreview(0, null)} compact />
                  <ImageUploadSlot label="Image 2" preview={imagePreviews[1]} onFile={f => handleImageFile(1, f)} onClear={() => setPreview(1, null)} compact />
                  <ImageUploadSlot label="Image 3" preview={imagePreviews[2]} onFile={f => handleImageFile(2, f)} onClear={() => setPreview(2, null)} compact />
                  <ImageUploadSlot label="Image 4" preview={imagePreviews[3]} onFile={f => handleImageFile(3, f)} onClear={() => setPreview(3, null)} compact />
                </div>
                <div className="mt-1 flex items-center justify-between text-[9px] text-gray-400">
                  <span>Best fit: 4:5 (1024×1280 px)</span>
                  <span>Max 5MB / slot</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Enter package description..." className={inp} />
            </div>

            {/* Trip Route, Hub & Style Highlights */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Highlights Bar & Route Details</span>
                  <span className="text-[10px] font-normal text-gray-400">(Dynamic fields shown on package page)</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Route Summary</label>
                  <Input
                    value={route}
                    onChange={e => setRoute(e.target.value)}
                    type="text"
                    placeholder="e.g., Via Lucknow & Hilsa"
                    className={inp + " bg-white h-auto"}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Departure Hub / City</label>
                  <Input
                    value={departure}
                    onChange={e => setDeparture(e.target.value)}
                    type="text"
                    placeholder="e.g., Lucknow, India"
                    className={inp + " bg-white h-auto"}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Tour Style</label>
                  <Input
                    value={tourStyle}
                    onChange={e => setTourStyle(e.target.value)}
                    type="text"
                    placeholder="e.g., Spiritual Pilgrimage"
                    className={inp + " bg-white h-auto"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Curated Route Banner Title (Optional)</label>
                  <Input
                    value={routeBannerTitle}
                    onChange={e => setRouteBannerTitle(e.target.value)}
                    type="text"
                    placeholder="e.g., Lucknow Overland & Helicopter Route"
                    className={inp + " bg-white h-auto"}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Curated Route Banner Subtitle (Optional)</label>
                  <Input
                    value={routeBannerSubtitle}
                    onChange={e => setRouteBannerSubtitle(e.target.value)}
                    type="text"
                    placeholder="e.g., Depart from Lucknow → Nepalgunj → Flight to Simikot..."
                    className={inp + " bg-white h-auto"}
                  />
                </div>
              </div>
            </div>

            {/* Itinerary Section */}
            <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-100">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Day-by-Day Itinerary ({itineraryDays.length} Days)
                  </h3>
                  <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full shadow-2xs">
                    Structured & Bullets
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={expandAllItinerary}
                    className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-white px-2.5 py-1 rounded border border-indigo-200 transition-colors shadow-2xs cursor-pointer"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllItinerary}
                    className="text-[11px] font-semibold text-gray-600 hover:text-gray-900 bg-white px-2.5 py-1 rounded border border-gray-200 transition-colors shadow-2xs cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div className="space-y-3 mt-3">
                {itineraryDays.map((day, index) => {
                  const pointsCount = (day.description || '').split(/\r?\n/).filter(l => l.trim()).length;
                  const isCollapsed = !!day.isCollapsed;

                  return (
                    <div
                      key={day.id}
                      className="bg-white rounded-lg border border-indigo-100 shadow-xs overflow-hidden transition-all"
                    >
                      {/* Day Card Header */}
                      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border-b border-indigo-50/80">
                        <div
                          className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                          onClick={() => toggleDayCollapse(day.id)}
                        >
                          <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-bold tracking-wide shadow-xs flex-shrink-0">
                            Day {index + 1}
                          </span>
                          <span className="font-bold text-xs text-gray-800 truncate">
                            {day.title || `Day ${index + 1} Schedule`}
                          </span>
                          {(day.route || day.altitude) && (
                            <span className="hidden sm:inline-flex text-[10px] text-gray-500 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 truncate">
                              {[day.route, day.altitude].filter(Boolean).join(' • ')}
                            </span>
                          )}
                        </div>

                        {/* Controls: Reorder, Collapse, Delete */}
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => moveDay(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-25 disabled:cursor-not-allowed rounded hover:bg-indigo-50 transition-colors"
                            title="Move Day Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveDay(index, 'down')}
                            disabled={index === itineraryDays.length - 1}
                            className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-25 disabled:cursor-not-allowed rounded hover:bg-indigo-50 transition-colors"
                            title="Move Day Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleDayCollapse(day.id)}
                            className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
                            title={isCollapsed ? 'Expand Day' : 'Collapse Day'}
                          >
                            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeDay(day.id)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors ml-1"
                            title="Delete Day"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Day Card Body */}
                      {!isCollapsed && (
                        <div className="p-3.5 space-y-3">
                          {/* Title */}
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                              Day Title
                            </label>
                            <Input
                              value={day.title}
                              onChange={e =>
                                setItineraryDays(prev =>
                                  prev.map(d => (d.id === day.id ? { ...d, title: e.target.value } : d))
                                )
                              }
                              type="text"
                              placeholder="e.g., Lucknow → Nepalgunj"
                              className={inp + ' h-auto text-xs font-semibold'}
                            />
                          </div>

                          {/* Route Summary & Altitude */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-medium text-gray-600 mb-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-indigo-500" />
                                <span>Route & Distance</span>
                              </label>
                              <Input
                                value={day.route || ''}
                                onChange={e =>
                                  setItineraryDays(prev =>
                                    prev.map(d => (d.id === day.id ? { ...d, route: e.target.value } : d))
                                  )
                                }
                                type="text"
                                placeholder="e.g., 180 km / 4–5 hrs by road"
                                className={inp + ' h-auto text-xs'}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-medium text-gray-600 mb-1">
                                Altitude / Elevation
                              </label>
                              <Input
                                value={day.altitude || ''}
                                onChange={e =>
                                  setItineraryDays(prev =>
                                    prev.map(d => (d.id === day.id ? { ...d, altitude: e.target.value } : d))
                                  )
                                }
                                type="text"
                                placeholder="e.g., 15,060 ft / 4,860 m"
                                className={inp + ' h-auto text-xs'}
                              />
                            </div>
                          </div>

                          {/* Stay, Meals, Transport */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                            <div>
                              <label className="block text-[10px] font-medium text-gray-600 mb-1 flex items-center gap-1">
                                <Bed className="w-3 h-3 text-amber-500" />
                                <span>Accommodation / Stay</span>
                              </label>
                              <Input
                                value={day.stay || ''}
                                onChange={e =>
                                  setItineraryDays(prev =>
                                    prev.map(d => (d.id === day.id ? { ...d, stay: e.target.value } : d))
                                  )
                                }
                                type="text"
                                placeholder="e.g., Hotel 3-Star / Twin Sharing"
                                className={inp + ' h-auto text-xs bg-white'}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-medium text-gray-600 mb-1 flex items-center gap-1">
                                <Utensils className="w-3 h-3 text-emerald-500" />
                                <span>Meals</span>
                              </label>
                              <Input
                                value={day.meals || ''}
                                onChange={e =>
                                  setItineraryDays(prev =>
                                    prev.map(d => (d.id === day.id ? { ...d, meals: e.target.value } : d))
                                  )
                                }
                                type="text"
                                placeholder="e.g., Breakfast, Lunch & Dinner"
                                className={inp + ' h-auto text-xs bg-white'}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-medium text-gray-600 mb-1 flex items-center gap-1">
                                <Bus className="w-3 h-3 text-blue-500" />
                                <span>Transport</span>
                              </label>
                              <Input
                                value={day.transport || ''}
                                onChange={e =>
                                  setItineraryDays(prev =>
                                    prev.map(d => (d.id === day.id ? { ...d, transport: e.target.value } : d))
                                  )
                                }
                                type="text"
                                placeholder="e.g., Flight / Helicopter / Coach"
                                className={inp + ' h-auto text-xs bg-white'}
                              />
                            </div>
                          </div>

                          {/* Activities Textarea */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5 mt-2">
                              <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                <span>Activities & Sightseeing</span>
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">
                                  Press Enter for new bullet
                                </span>
                              </label>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => addBulletToDay(day.id)}
                                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-0.5 rounded-md transition-colors border border-indigo-200 cursor-pointer"
                                  title="Add a new bullet point line"
                                >
                                  + Add Bullet
                                </button>
                                <button
                                  type="button"
                                  onClick={() => autoFormatToBullets(day.id, day.description)}
                                  title="Automatically convert text into clean bullet points"
                                  className="text-[11px] font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-0.5 rounded-md transition-colors border border-amber-200 cursor-pointer"
                                >
                                  ⚡ Auto-Format
                                </button>
                              </div>
                            </div>

                            <Textarea
                              value={day.description}
                              onChange={e =>
                                setItineraryDays(prev =>
                                  prev.map(d => (d.id === day.id ? { ...d, description: e.target.value } : d))
                                )
                              }
                              onKeyDown={e => handleItineraryKeyDown(e, day.id)}
                              onFocus={() => handleItineraryFocus(day.id, day.description)}
                              rows={4}
                              placeholder={
                                '• Arrival in Lucknow and transfer to hotel.\n• Check-in after 1:00 PM.\n• Evening dinner and orientation for the journey ahead.'
                              }
                              className={inp + ' text-xs leading-relaxed bg-white'}
                            />

                            {/* Live Counter & Info */}
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-1.5 px-0.5">
                              <span className="text-indigo-700 font-medium">
                                {pointsCount} {pointsCount === 1 ? 'activity listed' : 'activities listed'}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                Displays as formatted bullets on public website
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all text-sm font-bold shadow-2xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Itinerary Day
                </button>
              </div>
            </div>

            {/* Pricing Section with Explicit Selection */}
            <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <span>💰 Pricing Option</span>
                </h3>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-emerald-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPriceType('fixed')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      priceType === 'fixed' 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>Exact Price (₹)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPriceType('onRequest');
                      setOriginalPrice('');
                      setDiscountedPrice('');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      priceType === 'onRequest' 
                        ? 'bg-amber-600 text-white shadow-xs' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>Price on Request</span>
                  </button>
                </div>
              </div>

              {priceType === 'fixed' ? (
                <>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Original Price (₹)</label>
                      <Input type="text" placeholder="e.g. 25000" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className={inp + " bg-white h-auto"} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Discounted Price (₹ - Optional)</label>
                      <Input type="text" placeholder="e.g. 21999" value={discountedPrice} onChange={e => setDiscountedPrice(e.target.value)} className={inp + " bg-white h-auto"} />
                    </div>
                  </div>
                  {parseFloat(discountPercentage) > 0 && parseFloat(String(originalPrice || '').replace(/[^0-9.]/g, '')) > 0 && (
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200 border-dashed flex justify-between items-center text-xs font-semibold">
                      <span className="text-emerald-700 font-bold">{discountPercentage}% OFF</span>
                      <span className="text-gray-500 italic">Save ₹{(parseFloat(String(originalPrice || '').replace(/[^0-9.]/g, '')) - parseFloat(String(discountedPrice || '').replace(/[^0-9.]/g, ''))).toFixed(0)}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                  <p className="text-xs font-bold text-amber-800">
                    ✨ "Price on Request" Option Selected
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Website customers will see "Price on Request" with direct WhatsApp & Inquiry options instead of numerical price.
                  </p>
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded p-4 border border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-semibold">Trending</span>
                </div>
                <input type="checkbox" checked={isTrending} onChange={e => setIsTrending(e.target.checked)} className="w-4 h-4" />
              </div>
              <div className="bg-blue-50 rounded p-4 border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold">Special Offer</span>
                </div>
                <input type="checkbox" checked={hasOffer} onChange={e => setHasOffer(e.target.checked)} className="w-4 h-4" />
              </div>
              <div className="bg-red-50 rounded p-4 border border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-semibold">Bestseller</span>
                </div>
                <input type="checkbox" checked={isBestseller} onChange={e => setIsBestseller(e.target.checked)} className="w-4 h-4" />
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TagEntryField
                label="Inclusions"
                items={inclusions}
                onAdd={val => setInclusions(prev => [...prev, val])}
                onRemove={idx => setInclusions(prev => prev.filter((_, i) => i !== idx))}
                placeholder="e.g., Breakfast"
                accentColor="green"
                icon={<CheckCircle2 className="w-4 h-4" />}
              />
              <TagEntryField
                label="Exclusions"
                items={exclusions}
                onAdd={val => setExclusions(prev => [...prev, val])}
                onRemove={idx => setExclusions(prev => prev.filter((_, i) => i !== idx))}
                placeholder="e.g., Personal Expense"
                accentColor="red"
                icon={<XCircle className="w-4 h-4" />}
              />
              <div className="md:col-span-2">
                <TagEntryField
                  label="Terms & Conditions"
                  items={termsAndConditions}
                  onAdd={val => setTermsAndConditions(prev => [...prev, val])}
                  onRemove={idx => setTermsAndConditions(prev => prev.filter((_, i) => i !== idx))}
                  placeholder="e.g., 50% advance payment required"
                  accentColor="gray"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* 4. Package Tags */}
            <PackageTagsSection tags={tags} setTags={setTags} />

            {/* 5. SEO Settings Section */}
            <PackageSeoSection
              title={title}
              slug={slug}
              location={location}
              duration={duration}
              category={category}
              description={description}
              seoTitle={seoTitle}
              setSeoTitle={setSeoTitle}
              seoDescription={seoDescription}
              setSeoDescription={setSeoDescription}
              focusKeyword={focusKeyword}
              setFocusKeyword={setFocusKeyword}
              relatedKeywords={relatedKeywords}
              setRelatedKeywords={setRelatedKeywords}
            />
          </div>

          {/* 6. Footer Controls */}
          <div className="flex-shrink-0 flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
            <button onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm text-gray-600 font-medium">Cancel</button>
            <button
              disabled={isSaving}
              onClick={handleCreate}
              className={`px-6 py-2 flex items-center gap-2 text-sm text-white rounded font-bold shadow-lg disabled:opacity-50 cursor-pointer ${
                isEditMode
                  ? 'bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700'
                  : 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700'
              }`}
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving
                ? (isEditMode ? 'Saving...' : 'Creating...')
                : (isEditMode ? 'Save Changes' : 'Create Package')
              }
            </button>
          </div>
        </div>
      </div>

      {showTypeModal && (
        <CustomCategoryModal onSave={name => { setCustomTypes(prev => [...prev, name]); setSelectedType(name); setShowTypeModal(false); }} onClose={() => setShowTypeModal(false)} />
      )}
    </>
  );
}
