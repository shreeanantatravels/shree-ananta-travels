"use client";
import { Plus, Save, Trash2, Upload, Globe2, Home, MapPin, Loader2, Award, ShieldCheck, BarChart3, BookOpen, Info, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useGetContentSectionsQuery, useCreateContentSectionMutation, useUpdateContentSectionMutation, useDeleteContentSectionMutation } from '../api/contentSectionApi';
import type { ContentSectionData } from '../api/contentSectionApi';
import { useGetSiteConfigQuery, useUpdateSiteConfigMutation } from '../api/siteConfigApi';
import type { DestinationData } from '../api/siteConfigApi';
import { toast } from 'sonner';

const tabs = ['Destinations', 'FAQ'];

// ── Travel Themes ──────────────────────────────────────────────────────────────

interface TravelThemeItem {
  id: number;
  name: string;
  emoji: string;
  active: boolean;
}

const initialThemes: TravelThemeItem[] = [];

function TravelThemesTable() {
  const [themes, setThemes] = useState<TravelThemeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle]  = useState('');
  const [newImage, setNewImage]  = useState<string | null>(null);
  const [dragging, setDragging]  = useState(false);
  const [savingId, setSavingId]  = useState<number | string | null>(null);

  // ── Fetch themes from DB ──────────────────────────────────────────────────
  const fetchThemes = async () => {
    try {
      const res = await fetch('/api/content?sectionType=travel_theme');
      const data = await res.json();
      if (data.success && data.data) {
        setThemes(data.data.map((item: any) => ({
          id: item._id,
          name: item.title,
          emoji: '✈️',
          active: item.isActive !== false,
        })));
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { fetchThemes(); }, []);

  const toggleActive = async (id: number | string) => {
    const item = themes.find((t) => t.id === id);
    if (!item) return;
    const newActive = !item.active;
    setSavingId(id);
    setThemes(prev => prev.map(t => t.id === id ? { ...t, active: newActive } : t));
    try {
      await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newActive }),
      });
      toast.success(`${item.name} set to ${newActive ? 'Active' : 'Inactive'}`);
    } catch {
      toast.error('Failed to update theme');
      setThemes(prev => prev.map(t => t.id === id ? { ...t, active: !newActive } : t));
    }
    setSavingId(null);
  };

  const deleteTheme = async (id: number | string) => {
    setSavingId(id);
    const prev = themes;
    setThemes(themes.filter(t => t.id !== id));
    try {
      await fetch(`/api/content/${id}`, { method: 'DELETE' });
      toast.success('Theme deleted');
    } catch {
      toast.error('Failed to delete');
      setThemes(prev);
    }
    setSavingId(null);
  };

  const updateName = async (id: number | string, name: string) => {
    setThemes(prev => prev.map(t => t.id === id ? { ...t, name } : t));
    try {
      await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: name }),
      });
    } catch {
      toast.error('Failed to save name');
    }
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setNewImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddTheme = async () => {
    if (!newTitle.trim()) return;
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: 'travel_theme',
          title: newTitle.trim(),
          imageUrl: newImage || '',
          content: 'Curated Experience',
          isActive: true,
        }),
      });
      toast.success('Theme created successfully!');
      closeModal();
      await fetchThemes();
    } catch {
      toast.error('Failed to create theme');
    }
  };

  const closeModal = () => { setShowModal(false); setNewTitle(''); setNewImage(null); };

  if (isLoading) return (
    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Manage travel theme categories displayed on the homepage</p>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Theme
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Head */}
        <div className="grid grid-cols-[2.5rem_1fr_1fr_7rem_5rem] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <span>#</span>
          <span>Theme Name</span>
          <span>Image</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {themes.map((theme: TravelThemeItem, index: number) => (
          <div
            key={theme.id}
            className={`grid grid-cols-[2.5rem_1fr_1fr_7rem_5rem] gap-4 px-5 py-3.5 items-center border-b border-gray-100 last:border-0 transition-colors ${
              !theme.active ? 'bg-gray-50/60 opacity-70' : 'hover:bg-gray-50/40'
            }`}
          >
            <span className="text-sm text-gray-400 font-medium">{index + 1}</span>

            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl flex-shrink-0">{theme.emoji}</span>
              <Input
                type="text"
                value={theme.name}
                onChange={e => updateName(theme.id, e.target.value)}
                className="flex-1 min-w-0 px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent h-auto"
              />
            </div>

            <span className="text-xs text-gray-400 italic">Image via upload</span>

            <div className="flex items-center gap-2 w-fit">
              <span className={`text-xs font-semibold ${theme.active ? 'text-blue-600' : 'text-gray-500'}`}>
                {theme.active ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => toggleActive(theme.id)}
                disabled={savingId === theme.id}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  theme.active ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={theme.active}
              >
                <span className="sr-only">Toggle Active</span>
                {savingId === theme.id ? (
                  <Loader2 className={`w-3.5 h-3.5 text-white animate-spin absolute top-0.5 ${theme.active ? 'right-0.5' : 'left-0.5'}`} />
                ) : (
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      theme.active ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => deleteTheme(theme.id)}
                disabled={savingId === theme.id}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {themes.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No themes yet — click <strong>Add Theme</strong> to get started.
          </div>
        )}
      </div>

      {/* ── Add Theme Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Add Travel Theme</h2>
                <p className="text-xs text-gray-500 mt-0.5">Give it a title to display on the homepage</p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Theme Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTheme()}
                  placeholder="e.g. Adventure, Beach, Honeymoon..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTheme}
                disabled={!newTitle.trim()}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Add Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ── Destinations Tab (API-wired with Instant Auto-save & Per-item Loaders) ────

type DestCategory = 'domestic' | 'international';
const MAX_DESTINATIONS = 18;
type DestMode = 'domestic' | 'international' | 'both';

const REAL_CURATED_DESTINATIONS: DestinationData[] = [
  { name: 'Kashmir', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80' },
  { name: 'Kerala', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80' },
  { name: 'Goa', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80' },
  { name: 'Rajasthan', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80' },
  { name: 'Manali & Himachal', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=800&q=80' },
  { name: 'Ladakh', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80' },
  { name: 'Golden Triangle', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80' },
  { name: 'Andaman & Nicobar', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80' },
  { name: 'Varanasi', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80' },
  { name: 'Dubai', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
  { name: 'Maldives', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80' },
  { name: 'Bali', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' },
  { name: 'Switzerland', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80' },
  { name: 'Thailand', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80' },
  { name: 'Singapore', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80' },
];

function DestinationsTab() {
  const { data: configData, isLoading: configLoading } = useGetSiteConfigQuery();
  const [updateConfig] = useUpdateSiteConfigMutation();

  const [mode, setMode]                 = useState<DestMode>('both');
  const [destinations, setDestinations]   = useState<DestinationData[]>([]);
  const [addingTo, setAddingTo]         = useState<DestCategory | null>(null);
  const [newName, setNewName]           = useState('');
  const [activeLoadingKey, setActiveLoadingKey] = useState<string | null>(null);

  // Load from API
  useEffect(() => {
    if (configData?.data?.destinations) {
      setDestinations(configData.data.destinations);
    }
  }, [configData]);

  const saveDestinationsDirectly = async (updatedList: DestinationData[], key: string, successMsg?: string) => {
    setActiveLoadingKey(key);
    setDestinations(updatedList);
    try {
      await updateConfig({ destinations: updatedList } as any).unwrap();
      if (successMsg) toast.success(successMsg);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update destination');
      if (configData?.data?.destinations) {
        setDestinations(configData.data.destinations);
      }
    } finally {
      setActiveLoadingKey(null);
    }
  };

  const visibleCategories: DestCategory[] = mode === 'both'
    ? ['domestic', 'international']
    : [mode];

  const getCount = (cat: DestCategory) => destinations.filter(d => d.category === cat).length;

  const toggleActive = (idx: number) => {
    const target = destinations[idx];
    if (!target) return;
    const newState = !target.active;
    const updated = destinations.map((d, i) => i === idx ? { ...d, active: newState } : d);
    saveDestinationsDirectly(
      updated,
      `dest-${idx}-active`,
      `${target.name} set to ${newState ? 'Active' : 'Inactive'}`
    );
  };

  const toggleTrending = (idx: number) => {
    const target = destinations[idx];
    if (!target) return;
    const newState = !target.trending;
    const updated = destinations.map((d, i) => i === idx ? { ...d, trending: newState } : d);
    saveDestinationsDirectly(
      updated,
      `dest-${idx}-trending`,
      `${target.name} ${newState ? 'marked as highlight' : 'removed from highlight'}`
    );
  };

  const toggleNavbar = (idx: number) => {
    const target = destinations[idx];
    if (!target) return;
    const newState = !target.showInNavbar;
    const updated = destinations.map((d, i) => i === idx ? { ...d, showInNavbar: newState } : d);
    saveDestinationsDirectly(
      updated,
      `dest-${idx}-navbar`,
      `${target.name} ${newState ? 'added to navbar' : 'removed from navbar'}`
    );
  };

  const deleteDest = (idx: number) => {
    const target = destinations[idx];
    if (!target) return;
    const updated = destinations.filter((_, i) => i !== idx);
    saveDestinationsDirectly(updated, `dest-${idx}-delete`, `${target.name} removed`);
  };

  const startAdding = (cat: DestCategory) => { setAddingTo(cat); setNewName(''); };
  const cancelAdd   = ()                  => { setAddingTo(null); setNewName(''); };

  const confirmAdd = (cat: DestCategory) => {
    if (!newName.trim() || getCount(cat) >= MAX_DESTINATIONS) return;
    const addedName = newName.trim();
    const updated = [
      ...destinations,
      { name: addedName, active: true, trending: false, category: cat, image: '' },
    ];
    setAddingTo(null);
    setNewName('');
    saveDestinationsDirectly(updated, `add-${cat}`, `${addedName} added`);
  };

  const modeButtons: { value: DestMode; label: string; icon: any }[] = [
    { value: 'domestic',      label: 'Domestic',      icon: Home   },
    { value: 'international', label: 'International', icon: Globe2 },
    { value: 'both',          label: 'Both',          icon: MapPin },
  ];

  if (configLoading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>;

  const renderCategoryBlock = (cat: DestCategory) => {
    const catDests = destinations.map((d, idx) => ({ ...d, _idx: idx })).filter(d => d.category === cat);
    const count    = catDests.length;
    const isAdding = addingTo === cat;

    return (
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
            cat === 'domestic' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {cat === 'domestic' ? <Home className="w-3.5 h-3.5" /> : <Globe2 className="w-3.5 h-3.5" />}
            {cat === 'domestic' ? 'Domestic' : 'International'}
          </div>
          <span className="text-xs text-gray-400 font-medium">{count} / {MAX_DESTINATIONS}</span>
          {count >= MAX_DESTINATIONS && <span className="text-xs text-red-500 font-semibold">Limit reached</span>}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Head */}
          <div className="grid grid-cols-[2rem_1fr_6rem_6rem_3rem] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span>#</span>
            <span>Name</span>
            <span>Highlight</span>
            <span>Navbar</span>
            <span className="text-right">Del</span>
          </div>

          {/* Empty state */}
          {catDests.length === 0 && !isAdding && (
            <div className="py-7 text-center text-sm text-gray-400">
              No destinations yet — click <strong>+ Add</strong> below.
            </div>
          )}

          {/* Rows */}
          {catDests.map((dest, displayIdx) => {
            const isTrendingLoading = activeLoadingKey === `dest-${dest._idx}-trending`;
            const isNavbarLoading   = activeLoadingKey === `dest-${dest._idx}-navbar`;
            const isDeleteLoading   = activeLoadingKey === `dest-${dest._idx}-delete`;

            return (
              <div key={dest._idx} className="border-b border-gray-100 last:border-0">
                <div className="grid grid-cols-[2rem_1fr_6rem_6rem_3rem] gap-3 px-4 py-3 items-center hover:bg-gray-50/40 transition-colors">
                  <span className="text-xs text-gray-400 font-medium">{displayIdx + 1}</span>

                  <Input
                    type="text"
                    value={dest.name}
                    onChange={e => {
                      setDestinations(prev => prev.map((d, i) => i === dest._idx ? { ...d, name: e.target.value } : d));
                    }}
                    onBlur={e => {
                      if (e.target.value !== configData?.data?.destinations?.[dest._idx]?.name) {
                        const updated = destinations.map((d, i) => i === dest._idx ? { ...d, name: e.target.value } : d);
                        saveDestinationsDirectly(updated, `dest-${dest._idx}-name`, `${e.target.value} saved`);
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const updated = destinations.map((d, i) => i === dest._idx ? { ...d, name: (e.target as HTMLInputElement).value } : d);
                        saveDestinationsDirectly(updated, `dest-${dest._idx}-name`, `${(e.target as HTMLInputElement).value} saved`);
                      }
                    }}
                    className="w-full px-2 py-1 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent h-auto"
                  />

                  {/* Highlight toggle */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleTrending(dest._idx)}
                      disabled={activeLoadingKey !== null}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                        dest.trending ? 'bg-orange-400' : 'bg-gray-200'
                      }`}
                      role="switch" aria-checked={dest.trending}
                    >
                      <span className="sr-only">Mark as Highlight</span>
                      {isTrendingLoading ? (
                        <Loader2 className={`w-3.5 h-3.5 text-white animate-spin absolute top-0.5 ${dest.trending ? 'right-0.5' : 'left-0.5'}`} />
                      ) : (
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${dest.trending ? 'translate-x-4' : 'translate-x-0'}`} />
                      )}
                    </button>
                    <span className="text-sm leading-none">{dest.trending ? '⭐' : ''}</span>
                  </div>

                  {/* Navbar toggle */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleNavbar(dest._idx)}
                      disabled={activeLoadingKey !== null}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                        dest.showInNavbar ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                      role="switch" aria-checked={dest.showInNavbar}
                    >
                      <span className="sr-only">Show in Navbar</span>
                      {isNavbarLoading ? (
                        <Loader2 className={`w-3.5 h-3.5 text-white animate-spin absolute top-0.5 ${dest.showInNavbar ? 'right-0.5' : 'left-0.5'}`} />
                      ) : (
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${dest.showInNavbar ? 'translate-x-4' : 'translate-x-0'}`} />
                      )}
                    </button>
                    <span className="text-sm leading-none">{dest.showInNavbar ? '👁️' : ''}</span>
                  </div>

                  {/* Delete */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteDest(dest._idx)}
                      disabled={activeLoadingKey !== null}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      {isDeleteLoading ? (
                        <Loader2 className="w-3.5 h-3.5 text-red-500 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Image URL — only visible when highlight is ON */}
                {dest.trending && (
                  <div className="px-4 pb-3 pt-0">
                    <div className="flex items-center gap-3 bg-orange-50 rounded-lg px-3 py-2.5 border border-orange-100">
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs">🖼️</span>
                        <span className="text-[10px] font-semibold text-orange-600 uppercase tracking-wide">Cover Image</span>
                      </div>
                      <Input
                        type="text"
                        value={dest.image}
                        onChange={e => {
                          setDestinations(prev => prev.map((d, i) => i === dest._idx ? { ...d, image: e.target.value } : d));
                        }}
                        onBlur={e => {
                          if (e.target.value !== configData?.data?.destinations?.[dest._idx]?.image) {
                            const updated = destinations.map((d, i) => i === dest._idx ? { ...d, image: e.target.value } : d);
                            saveDestinationsDirectly(updated, `dest-${dest._idx}-image`, `${dest.name} image updated`);
                          }
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const updated = destinations.map((d, i) => i === dest._idx ? { ...d, image: (e.target as HTMLInputElement).value } : d);
                            saveDestinationsDirectly(updated, `dest-${dest._idx}-image`, `${dest.name} image updated`);
                          }
                        }}
                        placeholder="Paste image URL for carousel (e.g. https://images.unsplash.com/...)"
                        className="flex-1 px-2.5 py-1.5 border border-orange-200 rounded-md text-xs focus:ring-2 focus:ring-orange-400 focus:border-transparent h-auto bg-white placeholder:text-gray-400"
                      />
                      {dest.image && (
                        <img src={dest.image} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 border border-orange-200" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                    </div>
                    <p className="text-[10px] text-orange-400 mt-1 ml-1">This image will appear in the "Top Highlights" carousel on your website homepage</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Inline add row */}
          {isAdding ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50/60 border-t border-blue-100">
              <Input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') confirmAdd(cat); if (e.key === 'Escape') cancelAdd(); }}
                placeholder="Destination name…"
                className="flex-1 px-2.5 py-1.5 border border-blue-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent h-auto bg-white"
                autoFocus
              />
              <button
                onClick={() => confirmAdd(cat)}
                disabled={!newName.trim() || count >= MAX_DESTINATIONS || activeLoadingKey === `add-${cat}`}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
              >
                {activeLoadingKey === `add-${cat}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}
              </button>
              <button
                onClick={cancelAdd}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            count < MAX_DESTINATIONS && (
              <button
                onClick={() => startAdding(cat)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50/50 transition-colors border-t border-gray-100 font-medium"
              >
                <Plus className="w-4 h-4" /> Add destination
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mode selector & Save Destinations button */}
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-gray-500 hidden sm:block">Show:</p>
          <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
            {modeButtons.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => { setMode(value); cancelAdd(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === value
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">Max {MAX_DESTINATIONS} per category</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <Check className="w-3.5 h-3.5" /> Auto-saves on toggle / blur
          </div>

          {destinations.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all destinations?')) {
                  saveDestinationsDirectly([], 'clear-all-destinations', 'All destinations removed!');
                }
              }}
              disabled={activeLoadingKey !== null}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 disabled:bg-gray-100 text-rose-600 border border-rose-200 rounded-xl text-sm font-semibold transition-all shadow-xs"
              title="Delete all destinations"
            >
              {activeLoadingKey === 'clear-all-destinations' ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
              ) : (
                <Trash2 className="w-4 h-4 text-rose-600" />
              )}
              Clear All
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              saveDestinationsDirectly(REAL_CURATED_DESTINATIONS, 'seed-real-destinations', 'Real destinations loaded and saved!');
            }}
            disabled={activeLoadingKey !== null}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 disabled:bg-gray-100 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-semibold transition-all shadow-xs"
            title="Populate list with real curated destinations"
          >
            {activeLoadingKey === 'seed-real-destinations' ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            ) : (
              <Globe2 className="w-4 h-4 text-emerald-600" />
            )}
            Load Real Destinations
          </button>

          <button
            type="button"
            onClick={() => {
              saveDestinationsDirectly(destinations, 'save-all-destinations', 'All destination changes saved successfully!');
            }}
            disabled={activeLoadingKey !== null}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            {activeLoadingKey === 'save-all-destinations' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Destinations
          </button>
        </div>
      </div>

      {/* Side by side on desktop, stacked on mobile */}
      <div className={mode === 'both' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}>
        {visibleCategories.map(cat => (
          <div key={cat}>{renderCategoryBlock(cat)}</div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ContentSections() {
  const [activeTab, setActiveTab] = useState('Destinations');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Content Sections</h1>
        <p className="text-gray-600 mt-1">Manage homepage content and sections</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Destinations */}
      {activeTab === 'Destinations' && <DestinationsTab />}

      {/* Why Choose Us */}
      {activeTab === 'Why Choose Us' && <WhyChooseUsTab />}

      {/* FAQ */}
      {activeTab === 'FAQ' && <FAQTab />}
    </div>
  );
}

// ── Why Choose Us Tab (API-wired with per-item loading) ───────────────────────

function WhyChooseUsTab() {
  const { data, isLoading } = useGetContentSectionsQuery();
  const [createSection, { isLoading: isCreating }] = useCreateContentSectionMutation();
  const [updateSection] = useUpdateContentSectionMutation();
  const [deleteSection] = useDeleteContentSectionMutation();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const sections = (data?.data || []).filter(s => s.sectionType === 'why_choose_us');

  const handleAdd = async () => {
    try {
      await createSection({ sectionType: 'why_choose_us', title: 'New Card', content: 'Describe your strength' }).unwrap();
      toast.success('Card added!');
    } catch (err: any) { toast.error(err?.data?.message || 'Failed to add'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this card?')) return;
    setDeletingId(id);
    try { await deleteSection(id).unwrap(); toast.success('Removed!'); }
    catch (err: any) { toast.error('Failed to remove'); }
    finally { setDeletingId(null); }
  };

  const handleUpdate = async (id: string, updates: Partial<ContentSectionData>) => {
    setUpdatingId(id);
    try { await updateSection({ id, data: updates }).unwrap(); toast.success('Updated!'); }
    catch (err: any) { toast.error('Failed to save'); }
    finally { setUpdatingId(null); }
  };

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Highlight your strengths — shown on marketplace</p>
        <button onClick={handleAdd} disabled={isCreating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50">
          {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Card
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(s => (
          <div key={s._id} className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                {s.items?.[0]?.icon || '⭐'}
              </div>
              <div className="flex-1 space-y-3">
                <Input type="text" defaultValue={s.title} placeholder="Card title"
                  onBlur={e => { if (e.target.value !== s.title) handleUpdate(s._id, { title: e.target.value }); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-auto bg-white" />
                <Textarea rows={2} defaultValue={s.content} placeholder="Card description"
                  onBlur={(e: any) => { if (e.target.value !== s.content) handleUpdate(s._id, { content: e.target.value }); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
                <button onClick={() => handleDelete(s._id)} disabled={deletingId === s._id}
                  className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-1 disabled:opacity-50">
                  {deletingId === s._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sections.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-400">No cards yet — click <strong>Add Card</strong> to highlight your strengths.</div>
      )}
    </div>
  );
}

// ── FAQ Tab (Direct Database FAQ Management) ────────────────────────────────

import { Faqs as FaqsManager } from './Faqs';

function FAQTab() {
  return (
    <div className="bg-gray-50/50 rounded-2xl p-2 -m-2">
      <FaqsManager />
    </div>
  );
}
