"use client";
import { X, Tag, Award, TrendingUp, Plus, Trash2, Calendar, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCreatePackageMutation, useUpdatePackageMutation, PackageData } from '../api/packageApi';
import { toast } from 'sonner';
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { TagEntryField } from './package/TagEntryField';
import { CustomCategoryModal } from './package/CustomCategoryModal';
import { ImageUploadSlot } from './package/ImageUploadSlot';

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
}

export function PackageModal({ isOpen, onClose, initialData }: PackageModalProps) {
  const isEditMode = !!initialData;

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('domestic');
  const [description, setDescription] = useState('');

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

  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setTitle(initialData.title || '');
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
      setSelectedType(initialData.packageType || '');
      setItineraryDays(
        (initialData.itinerary || []).map((d, i) => ({
          id: d._id || String(i),
          dayNumber: d.dayNumber,
          title: d.title,
          description: d.description,
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
      setTitle(''); setLocation(''); setDuration('');
      setCategory('domestic'); setDescription('');
      setPriceType('fixed');
      setOriginalPrice(''); setDiscountedPrice('');
      setIsBestseller(false); setHasOffer(false); setIsTrending(false);
      setInclusions([]); setExclusions([]); setTermsAndConditions([]); setSelectedType('');
      setItineraryDays([]);
      setImagePreviews([null, null, null, null]); setImageFiles([null, null, null, null]);
    }
  }, [isOpen, initialData]);

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
    setItineraryDays(prev => [...prev, { id: Date.now().toString(), dayNumber: prev.length + 1, title: '', description: '' }]);

  const handleCreate = async () => {
    if (!title || !location || !duration || !description) {
      toast.error('Please fill all critical required fields (Name, Destination, Duration, Description)');
      return;
    }
    
    try {
      const origAmt = priceType === 'fixed' && originalPrice ? (parseFloat(String(originalPrice).replace(/[^0-9.]/g, '')) || 0) : 0;
      const discAmt = priceType === 'fixed' && discountedPrice ? (parseFloat(String(discountedPrice).replace(/[^0-9.]/g, '')) || 0) : 0;

      const formData = new FormData();
      formData.append('title', title);
      formData.append('location', location);
      formData.append('duration', duration);
      formData.append('category', category);
      formData.append('packageType', selectedType || 'other');
      formData.append('description', description);
      formData.append('originalPrice', origAmt.toString());
      formData.append('discountedPrice', discAmt.toString());
      formData.append('isTrending', String(isTrending));
      formData.append('hasOffer', String(hasOffer));
      
      // Save only bestseller if checked
      formData.append('badges', JSON.stringify(isBestseller ? ['bestseller'] : []));
      
      formData.append('inclusions', JSON.stringify(inclusions));
      formData.append('exclusions', JSON.stringify(exclusions));
      formData.append('termsAndConditions', JSON.stringify(termsAndConditions));
      formData.append('itinerary', JSON.stringify(itineraryDays.map(d => ({
        dayNumber: d.dayNumber,
        title: d.title || `Day ${d.dayNumber}`,
        description: d.description || '...'
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
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Package Name</label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g., Kailash Mansarovar Yatra – 14D/13N" className={inp + " h-auto"} />
                </div>
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

            {/* Itinerary Section */}
            <div className="bg-indigo-50 rounded p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-900">Itinerary</h3>
              </div>
              <div className="space-y-3 mt-3">
                {itineraryDays.map((day, index) => (
                  <div key={day.id} className="bg-white rounded p-3 border border-gray-200 shadow-sm relative">
                    <button onClick={() => setItineraryDays(prev => prev.filter(d => d.id !== day.id))}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">{index + 1}</span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Day {index + 1}</span>
                    </div>
                    <Input 
                      value={day.title} 
                      onChange={e => setItineraryDays(prev => prev.map(d => d.id === day.id ? { ...d, title: e.target.value } : d))}
                      type="text" 
                      placeholder="Day Title" 
                      className={inp + " mb-2 h-auto"} 
                    />
                    <Textarea 
                      value={day.description}
                      onChange={e => setItineraryDays(prev => prev.map(d => d.id === day.id ? { ...d, description: e.target.value } : d))}
                      rows={2} 
                      placeholder="Day details..." 
                      className={inp} 
                    />
                  </div>
                ))}
                <button onClick={addItineraryDay}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-dashed border-indigo-300 text-indigo-600 rounded hover:bg-indigo-50 transition-all text-sm font-medium">
                  <Plus className="w-4 h-4" /> Add Day
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
          </div>

          <div className="flex-shrink-0 flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
            <button onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm text-gray-600 font-medium">Cancel</button>
            <button
              disabled={isSaving}
              onClick={handleCreate}
              className={`px-6 py-2 flex items-center gap-2 text-sm text-white rounded font-bold shadow-lg disabled:opacity-50 ${
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
