"use client";
import { useState, useEffect, useRef } from 'react';
import { Upload, Save, Loader2, Building2, Link2, Trash2, Image as ImageIcon, Plus, RefreshCw, ChevronUp, ChevronDown, Edit3, Check, Megaphone } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useGetSiteConfigQuery, useUpdateSiteConfigMutation } from '../api/siteConfigApi';
import { toast } from 'sonner';
import { extract10Digits } from '@/lib/utils/contactConfig';

const DEFAULT_NAV_LINKS = [
  { id: 'kailash', label: 'Kailash Mansarovar', url: '/kailash-mansarovar', isActive: true, canDelete: false, order: 1 },
  { id: 'domestic', label: 'Domestic', url: '/domestic', isDropdown: true, category: 'domestic', isActive: true, canDelete: false, order: 2 },
  { id: 'international', label: 'International', url: '/international', isDropdown: true, category: 'international', isActive: true, canDelete: false, order: 3 },
  { id: 'groups', label: 'Groups', url: '/packages?category=groups', isActive: true, canDelete: false, order: 4 },
  { id: 'spiritual', label: 'Spiritual', url: '/spiritual', isActive: true, canDelete: false, order: 5 },
  { id: 'services', label: 'Services', url: '/services', isActive: true, canDelete: false, order: 6 },
  { id: 'trending', label: 'Trending', url: '/trending', isActive: true, canDelete: false, order: 7 },
  { id: 'contact', label: 'Contact', url: '/contact', isActive: true, canDelete: false, order: 8 },
];

export function BrandingSettings() {
  const { data, isLoading } = useGetSiteConfigQuery();
  const [updateConfig] = useUpdateSiteConfigMutation();
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [isSavingNavbar, setIsSavingNavbar] = useState(false);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHeroImg, setIsUploadingHeroImg] = useState(false);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);
  const [isReplacingHeroImg, setIsReplacingHeroImg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const config = data?.data;

  // Local form state
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhoneDigits, setContactPhoneDigits] = useState('');
  const [whatsappDigits, setWhatsappDigits] = useState('');
  const [address, setAddress] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [defaultWhatsappMessage, setDefaultWhatsappMessage] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('IST');

  // Topbar Offer state
  const [topbarOfferText, setTopbarOfferText] = useState('');
  const [topbarOfferIsActive, setTopbarOfferIsActive] = useState(true);
  const [isSavingTopbar, setIsSavingTopbar] = useState(false);

  // Hero Banner state
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [customHeroUrl, setCustomHeroUrl] = useState('');

  // Navigation Links state
  const [navLinks, setNavLinks] = useState<{ id: string; label: string; url: string; isActive: boolean; canDelete: boolean; order: number; }[]>([]);
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavUrl, setNewNavUrl] = useState('');
  const [editingNavId, setEditingNavId] = useState<string | null>(null);

  const [initialized, setInitialized] = useState(false);

  // Populate from API
  useEffect(() => {
    if (config) {
      setCompanyName(config.companyName || '');
      setLogoUrl(config.logoUrl || '/uploads/shree-ananta-logo.jpg');
      setContactEmail(config.contactEmail || '');
      const initialDigits = extract10Digits(config.contactPhone || (data as any)?.agent?.whatsapp || '');
      setContactPhoneDigits(initialDigits);
      setWhatsappDigits(initialDigits);
      setAddress(config.address || '');
      setFacebookUrl(config.facebookUrl || '');
      setInstagramUrl(config.instagramUrl || '');
      setDefaultWhatsappMessage(config.defaultWhatsappMessage || '');
      setCurrency(config.currency || 'INR');
      setTimezone(config.timezone || 'IST');

      setTopbarOfferText(config.topbarOffer?.text || '');
      setTopbarOfferIsActive(config.topbarOffer?.isActive !== undefined ? config.topbarOffer.isActive : true);

      setHeroBadge(config.heroBadge || '');
      setHeroTitle(config.heroTitle || '');
      setHeroSubtitle(config.heroSubtitle || '');
      setHeroImages(config.heroImages || []);

      if (!initialized) {
        const existingLinks = config.navLinks || [];
        // Filter out legacy default items if present
        const hasLegacy = existingLinks.some((l: any) => l.id === 'home' || l.id === 'destinations' || l.id === 'packages');
        let combined = hasLegacy ? [...DEFAULT_NAV_LINKS] : [...existingLinks];

        DEFAULT_NAV_LINKS.forEach(def => {
          if (!combined.some(item => item.id === def.id)) {
            combined.push(def);
          }
        });

        combined.sort((a, b) => (a.order || 0) - (b.order || 0));
        combined = combined.map((item, i) => ({ ...item, order: i + 1 }));
        setNavLinks(combined);
        setInitialized(true);
      }
    }
  }, [config, initialized]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const resData = await res.json();

      if (resData.success && resData.url) {
        setLogoUrl(resData.url);
        toast.success('Logo uploaded! Saving config...');
        await updateConfig({
          logoUrl: resData.url,
        }).unwrap();
      } else {
        toast.error(resData.message || 'Failed to upload logo');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Logo upload failed');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingHeroImg(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('type', 'hero');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const resData = await res.json();

        if (resData.success && resData.url) {
          uploadedUrls.push(resData.url);
        }
      }
      if (uploadedUrls.length > 0) {
        const updatedList = [...heroImages, ...uploadedUrls];
        setHeroImages(updatedList);
        await updateConfig({ heroImages: updatedList, heroTitle, heroSubtitle }).unwrap();
        toast.success(`${uploadedUrls.length} background image(s) uploaded & saved!`);
      } else {
        toast.error('Failed to upload selected hero image(s)');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Hero image upload failed');
    } finally {
      setIsUploadingHeroImg(false);
    }
  };

  const handleAddHeroUrl = async () => {
    if (!customHeroUrl.trim()) return;
    const updatedList = [...heroImages, customHeroUrl.trim()];
    setHeroImages(updatedList);
    setCustomHeroUrl('');
    try {
      await updateConfig({ heroImages: updatedList, heroTitle, heroSubtitle }).unwrap();
      toast.success('Added & saved image URL to Hero backgrounds!');
    } catch {
      toast.error('Failed to save image URL');
    }
  };

  const triggerReplaceHeroImage = (index: number) => {
    setReplaceTargetIndex(index);
    replaceFileInputRef.current?.click();
  };

  const handleReplaceHeroImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceTargetIndex === null) return;

    const indexToReplace = replaceTargetIndex;
    setIsReplacingHeroImg(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'hero');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const resData = await res.json();

      if (resData.success && resData.url) {
        const updatedList = [...heroImages];
        updatedList[indexToReplace] = resData.url;
        setHeroImages(updatedList);
        await updateConfig({ heroImages: updatedList, heroTitle, heroSubtitle }).unwrap();
        toast.success(`Image #${indexToReplace + 1} updated! Old image deleted from Cloudinary.`);
      } else {
        toast.error(resData.message || 'Failed to replace image');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Image replacement failed');
    } finally {
      setIsReplacingHeroImg(false);
      setReplaceTargetIndex(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveHeroImage = async (index: number) => {
    const updatedList = heroImages.filter((_, i) => i !== index);
    setHeroImages(updatedList);
    try {
      await updateConfig({ heroImages: updatedList, heroTitle, heroSubtitle }).unwrap();
      toast.success('Image removed & old file deleted from Cloudinary.');
    } catch {
      toast.error('Failed to remove image');
    }
  };

  const handleToggleNavActive = (id: string) => {
    setNavLinks(prev => prev.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
  };

  const handleNavLabelChange = (id: string, newLabel: string) => {
    setNavLinks(prev => prev.map(l => l.id === id ? { ...l, label: newLabel } : l));
  };

  const handleNavUrlChange = (id: string, newUrl: string) => {
    setNavLinks(prev => prev.map(l => l.id === id ? { ...l, url: newUrl } : l));
  };

  const handleMoveNavUp = (idx: number) => {
    if (idx <= 0) return;
    setNavLinks(prev => {
      const sorted = [...prev].sort((a, b) => (a.order || 0) - (b.order || 0));
      const temp = sorted[idx];
      sorted[idx] = sorted[idx - 1];
      sorted[idx - 1] = temp;
      return sorted.map((item, i) => ({ ...item, order: i + 1 }));
    });
  };

  const handleMoveNavDown = (idx: number) => {
    setNavLinks(prev => {
      const sorted = [...prev].sort((a, b) => (a.order || 0) - (b.order || 0));
      if (idx >= sorted.length - 1) return prev;
      const temp = sorted[idx];
      sorted[idx] = sorted[idx + 1];
      sorted[idx + 1] = temp;
      return sorted.map((item, i) => ({ ...item, order: i + 1 }));
    });
  };

  const handleDeleteNav = (id: string) => {
    setNavLinks(prev => prev.filter(l => l.id !== id));
  };

  const handleAddNewNav = () => {
    if (!newNavLabel.trim() || !newNavUrl.trim()) return toast.error('Label and URL are required');
    setNavLinks(prev => [...prev, {
      id: 'custom-' + Date.now(),
      label: newNavLabel.trim(),
      url: newNavUrl.trim(),
      isActive: true,
      canDelete: true,
      order: prev.length + 1
    }]);
    setNewNavLabel('');
    setNewNavUrl('');
    toast.success('Added new link to list. Please click "Save Navbar Links".');
  };

  const handleSaveCompany = async () => {
    // Client-side phone validation
    if (contactPhoneDigits && contactPhoneDigits.trim()) {
      const cleanDigits = contactPhoneDigits.replace(/\D/g, '');
      if (cleanDigits.length !== 10) {
        toast.error('Please enter a valid 10-digit phone number.');
        return;
      }
    }
    // Client-side email validation
    if (contactEmail && contactEmail.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
        toast.error('Please enter a valid business email address.');
        return;
      }
    }

    const fullPhone = contactPhoneDigits.trim() ? `+91 ${contactPhoneDigits.replace(/\D/g, '')}` : '';

    setIsSavingCompany(true);
    try {
      await updateConfig({
        companyName,
        logoUrl,
        contactEmail,
        contactPhone: fullPhone,
        address,
        facebookUrl,
        instagramUrl,
      }).unwrap();
      toast.success('Company information saved!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save');
    } finally {
      setIsSavingCompany(false);
    }
  };

  const handleSaveTopbar = async () => {
    setIsSavingTopbar(true);
    try {
      const activeState = topbarOfferText.trim() ? (topbarOfferIsActive ?? true) : false;
      setTopbarOfferIsActive(activeState);
      await updateConfig({
        topbarOffer: {
          text: topbarOfferText.trim(),
          isActive: activeState,
        }
      }).unwrap();
      toast.success('Topbar announcement text saved!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save topbar announcement');
    } finally {
      setIsSavingTopbar(false);
    }
  };

  const handleSaveHero = async () => {
    setIsSavingHero(true);
    try {
      await updateConfig({
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroImages,
      }).unwrap();
      toast.success('Hero banner settings saved!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save hero settings');
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleSaveNavbar = async () => {
    setIsSavingNavbar(true);
    try {
      await updateConfig({
        navLinks,
      }).unwrap();
      toast.success('Navbar settings saved!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save');
    } finally {
      setIsSavingNavbar(false);
    }
  };

  const handleSave = async () => {
    if (contactPhoneDigits && contactPhoneDigits.trim()) {
      const cleanDigits = contactPhoneDigits.replace(/\D/g, '');
      if (cleanDigits.length !== 10) {
        toast.error('Please enter a valid 10-digit phone number.');
        return;
      }
    }

    const fullPhone = contactPhoneDigits.trim() ? `+91 ${contactPhoneDigits.replace(/\D/g, '')}` : '';

    setIsSavingAll(true);
    try {
      const activeState = topbarOfferText.trim() ? (topbarOfferIsActive ?? true) : false;
      await updateConfig({
        companyName,
        logoUrl,
        contactEmail,
        contactPhone: fullPhone,
        address,
        facebookUrl,
        instagramUrl,
        defaultWhatsappMessage,
        currency,
        timezone,
        topbarOffer: {
          text: topbarOfferText.trim(),
          isActive: activeState,
        },
        navLinks,
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroImages,
      }).unwrap();
      toast.success('Branding & Site settings saved successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save settings');
    } finally {
      setIsSavingAll(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Branding & Site Settings</h1>
        <p className="text-gray-600 mt-1 text-sm">Manage your company information, hero banner, logo, custom menu options, and site appearance.</p>
      </div>

      {/* Company Info & Logo */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Company Information & Logo</h2>
          <p className="text-xs text-gray-600 mt-0.5">These details appear in your marketplace's topbar, navbar, footer, and contact sections</p>
        </div>
        <div className="p-5 space-y-5">
          {/* Logo Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Company Logo
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-gray-50 hover:border-blue-400 cursor-pointer overflow-hidden transition-colors relative group"
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                )}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {logoUrl ? 'Change Logo' : 'Upload Logo'}
                </button>
                <p className="text-xs text-gray-500">Upload your brand logo (PNG, JPG, SVG). It will display on Navbar and Footer.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Company Name
              </label>
              <Input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Shree Ananta Travels"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="e.g. shreeanantatravels@gmail.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className="flex rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-xs">
                <span className="inline-flex items-center px-3.5 bg-gray-100 text-gray-700 font-semibold text-sm border-r border-gray-200 select-none">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={contactPhoneDigits}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setContactPhoneDigits(val);
                    setWhatsappDigits(val);
                  }}
                  placeholder="98765 43210"
                  className="w-full px-3.5 py-2.5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-medium"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">10-digit number. Automatically synchronized with WhatsApp.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                WhatsApp Number
              </label>
              <div className="flex rounded-xl border border-gray-200 bg-gray-100 overflow-hidden">
                <span className="inline-flex items-center px-3.5 bg-gray-200/70 text-gray-600 font-semibold text-sm border-r border-gray-200 select-none">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  disabled
                  value={contactPhoneDigits || whatsappDigits}
                  placeholder="Synced with Phone Number"
                  className="w-full px-3.5 py-2.5 bg-transparent text-gray-600 placeholder-gray-400 text-sm font-medium cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Automatically kept in sync with Business Phone & Admin Profile</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Office Address
            </label>
            <Textarea
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. E91, East of Kailash, Delhi 110065"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Facebook Page URL
              </label>
              <Input
                type="url"
                value={facebookUrl}
                onChange={e => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Instagram Page URL
              </label>
              <Input
                type="url"
                value={instagramUrl}
                onChange={e => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end px-5 pb-5 pt-2 border-t border-gray-100 mx-0">
          <button
            onClick={handleSaveCompany}
            disabled={isSavingCompany}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 font-medium text-sm disabled:opacity-50"
          >
            {isSavingCompany ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
            {isSavingCompany ? 'Saving...' : 'Save Company Info'}
          </button>
        </div>
      </div>

      {/* Topbar Announcement Banner / Middle Text */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-600" /> Topbar Center Announcement Text
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">Manage the offer / announcement text displayed in the middle of the topbar on your website</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">{topbarOfferIsActive ? 'Visible' : 'Hidden'}</span>
            <label className="relative inline-flex items-center cursor-pointer" title={topbarOfferIsActive ? "Click to Hide Topbar Text" : "Click to Show Topbar Text"}>
              <input
                type="checkbox"
                checked={topbarOfferIsActive}
                onChange={e => setTopbarOfferIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Center Announcement Text
            </label>
            <Input
              type="text"
              value={topbarOfferText}
              onChange={e => {
                const val = e.target.value;
                setTopbarOfferText(val);
                if (val.trim() && !topbarOfferIsActive) {
                  setTopbarOfferIsActive(true);
                }
              }}
              placeholder="e.g. Special Offer - Get 5% Off On All Packages!"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all h-auto font-medium"
            />
            <p className="text-xs text-gray-500 mt-1.5">This text will be displayed directly in the middle of the topbar on all pages of your website.</p>
          </div>
        </div>

        <div className="flex justify-end px-5 pb-5 pt-2 border-t border-gray-100 mx-0">
          <button
            type="button"
            onClick={handleSaveTopbar}
            disabled={isSavingTopbar}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2 font-medium text-sm disabled:opacity-50"
          >
            {isSavingTopbar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSavingTopbar ? 'Saving...' : 'Save Topbar Text'}
          </button>
        </div>
      </div>

      {/* Hero Banner & Background Images */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-500" /> Hero Banner Text & Background Images
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">Customize the main hero title, subtitle, and upload multiple background images for the slideshow</p>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Hero Titles */}
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Hero Top Oval Badge Text (Golden pill above title)
              </label>
              <Input
                type="text"
                value={heroBadge}
                onChange={e => setHeroBadge(e.target.value)}
                placeholder="e.g. SHREE ANANTA TRAVELS • JOURNEYS THAT CONNECT"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all h-auto font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Hero Main Title
              </label>
              <Input
                type="text"
                value={heroTitle}
                onChange={e => setHeroTitle(e.target.value)}
                placeholder="e.g. SHREE ANANTA TRAVEL • YOUR TRUSTED TRAVEL PARTNER"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all h-auto font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Hero Subtitle / Description
              </label>
              <Textarea
                rows={2}
                value={heroSubtitle}
                onChange={e => setHeroSubtitle(e.target.value)}
                placeholder="e.g. Discover Handcrafted Journeys & Unforgettable Experiences Across India & Worldwide"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Hero Background Images Uploader */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Hero Background Images Sliders ({heroImages.length} uploaded)
                </label>
                <p className="text-xs text-gray-500">Upload as many background images as you want. They will automatically slide every 5 seconds on the homepage.</p>
              </div>
              <input
                type="file"
                ref={heroFileInputRef}
                onChange={handleHeroImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => heroFileInputRef.current?.click()}
                disabled={isUploadingHeroImg}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                {isUploadingHeroImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Image File
              </button>
            </div>

            {/* Image URL Input */}
            <div className="flex items-center gap-2 pt-1">
              <Input
                type="url"
                value={customHeroUrl}
                onChange={e => setCustomHeroUrl(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddHeroUrl}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add URL
              </button>
            </div>

            {/* Hidden Input for Replacing Single Image */}
            <input
              type="file"
              ref={replaceFileInputRef}
              onChange={handleReplaceHeroImageFile}
              accept="image/*"
              className="hidden"
            />

            {/* Uploaded Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-3">
              {heroImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-100 shadow-sm">
                  <img src={img} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  {isReplacingHeroImg && replaceTargetIndex === idx ? (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-[11px] font-semibold gap-1.5 z-20">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                      <span>Replacing #{idx + 1}...</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                      <button
                        type="button"
                        onClick={() => triggerReplaceHeroImage(idx)}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md text-xs font-semibold flex items-center gap-1"
                        title={`Change Image #${idx + 1}`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Change
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveHeroImage(idx)}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md"
                        title={`Delete Image #${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded-md font-mono font-bold z-10">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>

            {heroImages.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1.5" />
                <p className="text-xs text-gray-500 font-medium">No custom hero images uploaded yet.</p>
                <p className="text-[11px] text-gray-400">The website will use default theme images until you upload custom background photos.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end px-5 pb-5 pt-2 border-t border-gray-100 mx-0">
          <button
            onClick={handleSaveHero}
            disabled={isSavingHero}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-2 font-medium text-sm disabled:opacity-50"
          >
            {isSavingHero ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSavingHero ? 'Saving...' : 'Save Hero Banner Settings'}
          </button>
        </div>
      </div>

      {/* Navbar Links Manager */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-purple-600" /> Navbar Links Manager
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">Manage navigation items on your website. Change titles, URL paths, enable/disable links, and adjust display sequence.</p>
        </div>
        
        <div className="p-5 space-y-4">
          {/* List of existing links */}
          <div className="space-y-3">
            {navLinks.sort((a,b) => (a.order || 0) - (b.order || 0)).map((link, idx) => {
              const isEditing = editingNavId === link.id;

              if (isEditing) {
                return (
                  <div key={link.id} className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3 shadow-sm transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                        ✏️ Edit Item #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingNavId(null)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Done
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Title / Label Name</label>
                        <Input
                          type="text"
                          value={link.label}
                          onChange={e => handleNavLabelChange(link.id, e.target.value)}
                          className="bg-white text-xs font-semibold h-9 border-purple-300 focus:ring-purple-500"
                          placeholder="e.g. Domestic Tours"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">URL Path / Href</label>
                        <Input
                          type="text"
                          value={link.url}
                          onChange={e => handleNavUrlChange(link.id, e.target.value)}
                          className="bg-white text-xs font-mono h-9 border-purple-300 focus:ring-purple-500"
                          placeholder="e.g. /domestic"
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={link.id} className="flex items-center justify-between p-3.5 bg-gray-50/90 border border-gray-200/80 rounded-xl hover:bg-white hover:border-gray-300 transition-all">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Up / Down reorder arrows */}
                    <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveNavUp(idx)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === navLinks.length - 1}
                        onClick={() => handleMoveNavDown(idx)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0" title={link.isActive ? "Click to Disable" : "Click to Enable"}>
                      <input
                        type="checkbox"
                        checked={link.isActive}
                        onChange={() => handleToggleNavActive(link.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold leading-none ${link.isActive ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{link.label}</span>
                        <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200/60 truncate max-w-[180px] sm:max-w-[280px]">
                          {link.url}
                        </span>
                        {!link.canDelete && (
                          <span className="text-[9px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded border border-purple-200 uppercase">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => setEditingNavId(link.id)}
                      className="p-1.5 sm:px-2.5 sm:py-1 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200/60 flex items-center gap-1 text-xs font-semibold"
                      title="Edit Title & URL Path"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    {/* Delete Button */}
                    {link.canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteNav(link.id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors border border-red-200/60"
                        title="Delete Custom Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Add Custom Link</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  value={newNavLabel}
                  onChange={e => setNewNavLabel(e.target.value)}
                  placeholder="Link Title (e.g. Special Offers)"
                  className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newNavUrl}
                  onChange={e => setNewNavUrl(e.target.value)}
                  placeholder="URL (e.g. /offers)"
                  className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddNewNav}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end px-5 pb-5 pt-2 border-t border-gray-100 mx-0">
          <button
            type="button"
            onClick={handleSaveNavbar}
            disabled={isSavingNavbar}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 font-medium text-sm disabled:opacity-50"
          >
            {isSavingNavbar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSavingNavbar ? 'Saving...' : 'Save Navbar Links'}
          </button>
        </div>
      </div>

      {/* Basic Site Settings */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Basic Site Settings</h2>
          <p className="text-xs text-gray-600 mt-0.5">Configure general settings</p>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Default WhatsApp Message
            </label>
            <Textarea
              rows={2}
              value={defaultWhatsappMessage}
              onChange={e => setDefaultWhatsappMessage(e.target.value)}
              placeholder="Hi! I'm interested in your travel packages. Can you help me plan my trip?"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSavingAll}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 font-medium disabled:opacity-50"
        >
          {isSavingAll ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSavingAll ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
