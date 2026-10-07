"use client";
import { Plus, Search, Edit, Trash2, TrendingUp, MapPin, Clock, Tag, ImageOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { PackageModal } from '../components/PackageModal';
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useGetPackagesQuery, useUpdatePackageMutation, useDeletePackageMutation, PackageData } from '../api/packageApi';
import { toast } from 'sonner';

export interface Badge {
  label: string;
  textColor: string;
  bgColor: string;
}

const mapBadges = (badgesRaw: string[]): Badge[] => {
  const mapping: any = {
    bestseller: { label: 'Bestseller', textColor: '#ffffff', bgColor: '#f59e0b' },
  };
  return badgesRaw.map((b) => mapping[b] || { label: b, textColor: '#ffffff', bgColor: '#6b7280' });
};

/* ─── Gradient palettes for image placeholders ───────────────── */
const gradients = [
  'from-blue-400 via-purple-500 to-pink-500',
  'from-orange-400 via-red-400 to-pink-500',
  'from-emerald-400 via-teal-400 to-cyan-500',
  'from-violet-500 via-purple-400 to-indigo-500',
  'from-amber-400 via-orange-400 to-red-400',
  'from-sky-400 via-blue-400 to-indigo-500',
];

/* ─── Package Card ───────────────────────────────────────────── */
function PackageCard({
  pkg,
  index,
  onEdit,
}: {
  pkg: PackageData;
  index: number;
  onEdit: (pkg: PackageData) => void;
}) {
  const gradient = gradients[index % gradients.length];
  const isActive = pkg.isActive;
  const hasDiscount = !!pkg.discountedPrice && !!pkg.originalPrice && pkg.originalPrice > 0 && pkg.discountedPrice < pkg.originalPrice;
  const savings = hasDiscount ? pkg.originalPrice - (pkg.discountedPrice || 0) : 0;
  const discountPercent = (hasDiscount && pkg.originalPrice > 0) ? Math.round((savings / pkg.originalPrice) * 100) : 0;
  const images = [pkg.imageUrl1, pkg.imageUrl2].filter(Boolean) as string[];
  const badgesObj = mapBadges(pkg.badges);

  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const handleToggleStatus = async () => {
    try {
      await updatePackage({ id: pkg._id, data: { isActive: !pkg.isActive } }).unwrap();
      toast.success(`Package marked as ${!pkg.isActive ? 'Active' : 'Inactive'}`);
    } catch (e) {
      toast.error('Failed to change status');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(pkg._id).unwrap();
        toast.success("Package deleted successfully");
      } catch (e) {
        toast.error("Failed to delete package");
      }
    }
  };

  return (
    <div className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col ${
      isActive ? 'border-gray-200/80 hover:shadow-blue-500/10' : 'border-gray-200/50 opacity-75 hover:opacity-100'
    }`}>

      {/* ── Image area ──────────────────────────────────────────── */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/15 transition-colors" />

        {images.length === 0 && (
          <ImageOff className="w-10 h-10 text-white/40" />
        )}

        {images.length > 0 && (
          <div className="absolute inset-0 flex">
            {images.slice(0, 2).map((src, i) => (
              <img key={i} src={src} alt="" className={`h-full object-cover ${images.length === 2 ? 'w-1/2' : 'w-full'}`} />
            ))}
          </div>
        )}

        {pkg.isTrending && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-orange-500 text-white rounded-lg text-[10px] font-semibold shadow-md">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        )}

        {pkg.hasOffer && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-semibold shadow-md">
            <Tag className="w-3 h-3" />
            Special Offer
          </div>
        )}

        {/* Bottom: Category (left) + Package Type (right) */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-3 pb-2.5 pt-8 bg-gradient-to-t from-black/50 to-transparent">
          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full ring-1 ring-white/30">
            {pkg.category}
          </span>
          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full ring-1 ring-white/30">
            {pkg.packageType}
          </span>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Badges */}
        {badgesObj.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {badgesObj.map((b, i) => (
              <span
                key={i}
                style={{ backgroundColor: b.bgColor, color: b.textColor }}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide shadow-sm"
              >
                {b.label}
              </span>
            ))}
          </div>
        )}

        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug mb-2 line-clamp-2">
          {pkg.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="capitalize">{pkg.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            {pkg.duration}
          </div>
        </div>

        {/* Inclusions */}
        {pkg.inclusions.length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Inclusions</p>
            <div className="flex flex-wrap gap-1">
              {pkg.inclusions.slice(0, 3).map((inc, i) => (
                <span key={i} className="flex items-center gap-0.5 text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full ring-1 ring-green-200">
                  <span className="text-green-500">✓</span> {inc}
                </span>
              ))}
              {pkg.inclusions.length > 3 && (
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  +{pkg.inclusions.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Exclusions */}
        {pkg.exclusions.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Exclusions</p>
            <div className="flex flex-wrap gap-1">
              {pkg.exclusions.slice(0, 2).map((exc, i) => (
                <span key={i} className="flex items-center gap-0.5 text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full ring-1 ring-red-200">
                  <span className="text-red-400">✕</span> {exc}
                </span>
              ))}
              {pkg.exclusions.length > 2 && (
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  +{pkg.exclusions.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Discount bar */}
        {hasDiscount && (
          <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-1.5 mb-3">
            <span className="text-[11px] text-green-700 font-medium">
              Save ₹{savings.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-green-700 font-bold">
              {discountPercent}% OFF
            </span>
          </div>
        )}

        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          {(pkg.discountedPrice || pkg.originalPrice) ? (
            <>
              <span className="text-xl font-bold text-gray-900">
                ₹{(pkg.discountedPrice || pkg.originalPrice).toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
              )}
              <span className="text-xs text-gray-400 ml-auto">per person</span>
            </>
          ) : (
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Price on Request
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
          <div className="flex items-center gap-2 mr-auto">
            <button
              onClick={handleToggleStatus}
              disabled={isUpdating}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                isActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  isActive ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className={`text-[11px] font-semibold ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button
            onClick={() => onEdit(pkg)}
            className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-md hover:shadow-blue-500/30 transition-all"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDelete} className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-all" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Packages page ────────────────────────────────────────── */
export function Packages() {
  const { data: packageRes, isLoading } = useGetPackagesQuery();
  const packages = packageRes?.data || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageData | null>(null);

  const openCreate = () => { setEditingPkg(null); setIsModalOpen(true); };
  const openEdit   = (pkg: PackageData) => { setEditingPkg(pkg); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingPkg(null); };

  const filtered = packages.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const catSearchMatch = filterCategory === 'all_categories' ? '' : filterCategory;
    const matchCat = !catSearchMatch ||
      (catSearchMatch === 'trending' ? p.isTrending : p.category.toLowerCase() === catSearchMatch);
    const matchStatus = filterStatus === 'all_status' || !filterStatus ? true :
      (filterStatus === 'active' ? p.isActive === true : p.isActive === false);
    return matchSearch && matchCat && matchStatus;
  });

  const activeCount   = packages.filter(p => p.isActive).length;
  const inactiveCount = packages.filter(p => !p.isActive).length;
  const trendingCount = packages.filter(p => p.isTrending).length;

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
          <p className="text-gray-600 mt-1">Manage your travel packages and offerings</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 w-fit font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Package
        </button>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',    value: packages.length,  color: 'text-gray-900',   bg: 'bg-gray-50',   border: 'border-gray-200' },
          { label: 'Active',   value: activeCount,       color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
          { label: 'Inactive', value: inactiveCount,     color: 'text-gray-500',   bg: 'bg-gray-50',   border: 'border-gray-200' },
          { label: 'Trending', value: trendingCount,     color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/50 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder="Search packages or destination…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[160px] h-[42px] bg-gray-50 border-gray-200 rounded-xl text-sm font-medium px-4">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_categories">All Categories</SelectItem>
              <SelectItem value="domestic">Domestic</SelectItem>
              <SelectItem value="international">International</SelectItem>
              <SelectItem value="kailash">Kailash Mansarovar</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[140px] h-[42px] bg-gray-50 border-gray-200 rounded-xl text-sm font-medium px-4">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
          <p className="text-gray-500 font-medium">Loading Packages...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No packages found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters, or add a new package.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pkg, idx) => (
            <PackageCard key={pkg._id} pkg={pkg} index={idx} onEdit={openEdit} />
          ))}
        </div>
      )}

      {/* ── Modal ───────────────────────────────────────────────── */}
      <PackageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingPkg ?? undefined}
      />
    </div>
  );
}
