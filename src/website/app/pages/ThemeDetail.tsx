// @ts-nocheck
"use client";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  ArrowLeft, MapPin, Calendar, Star, Check, Sparkles, Filter, Search,
  Compass, ShieldCheck, Clock, Award, PhoneCall, ArrowRight, Heart, Share2
} from 'lucide-react';
import { Topbar } from '../components/Topbar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatbotButton } from '../components/ChatbotButton';
import { PlanTourModal } from '../components/PlanTourModal';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

interface ThemeProfile {
  name: string;
  emoji: string;
  tagline: string;
  heroImage: string;
  primaryColor: string;
  gradient: string;
  badgeBg: string;
  accentText: string;
  highlights: string[];
  packages: Array<{
    id: string;
    title: string;
    location: string;
    duration: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    image: string;
    tags: string[];
    isPopular?: boolean;
  }>;
}

const THEME_PROFILES: Record<string, ThemeProfile> = {
  beach: {
    name: 'Beach & Islands',
    emoji: '🏖️',
    tagline: 'Sun-soaked coastal paradises, crystal turquoise lagoons & luxury overwater villas',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
    primaryColor: '#06b6d4',
    gradient: 'from-cyan-600 via-teal-500 to-blue-600',
    badgeBg: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-400/30',
    accentText: 'text-cyan-600 dark:text-cyan-400',
    highlights: ['Luxury Overwater Resorts', 'Scuba & Snorkeling Included', 'Private Sunset Cruises', 'Romantic Candlelight Dinners'],
    packages: [
      {
        id: '1',
        title: 'Maldives Overwater Bungalow Experience',
        location: 'Maldives',
        duration: '5 Days / 4 Nights',
        price: 89999,
        originalPrice: 110000,
        rating: 4.9,
        reviews: 240,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        tags: ['Overwater Villa', 'All Meals', 'Speedboat'],
        isPopular: true,
      },
      {
        id: '2',
        title: 'Goa Tropical Beach & Watersports Bash',
        location: 'Goa, India',
        duration: '4 Days / 3 Nights',
        price: 14999,
        originalPrice: 19999,
        rating: 4.8,
        reviews: 185,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
        tags: ['Parasailing', 'Beach Parties', 'Scooter Hire'],
      },
      {
        id: '3',
        title: 'Bali Tropical Island & Nusa Penida Escape',
        location: 'Bali, Indonesia',
        duration: '6 Days / 5 Nights',
        price: 34999,
        originalPrice: 42000,
        rating: 4.9,
        reviews: 195,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        tags: ['Private Villa', 'Kelingking Beach', 'Floating Breakfast'],
        isPopular: true,
      },
      {
        id: '4',
        title: 'Kerala Serene Backwaters & Kovalam Beach',
        location: 'Kerala, India',
        duration: '5 Days / 4 Nights',
        price: 22500,
        originalPrice: 28000,
        rating: 4.7,
        reviews: 142,
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
        tags: ['Houseboat Stay', 'Ayurvedic Massage', 'Beach Resort'],
      },
    ],
  },
  adventure: {
    name: 'Adventure & Trekking',
    emoji: '🏔️',
    tagline: 'High altitude Himalayan expeditions, white water rafting & thrilling pass treks',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80',
    primaryColor: '#10b981',
    gradient: 'from-emerald-600 via-teal-600 to-green-700',
    badgeBg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/30',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    highlights: ['High Altitude Pass Treks', 'Certified Mountain Guides', 'Camping Equipment Included', 'Safety First Protocols'],
    packages: [
      {
        id: '5',
        title: 'Ladakh Extreme Bikers Expedition & Pangong Tso',
        location: 'Leh Ladakh',
        duration: '7 Days / 6 Nights',
        price: 24999,
        originalPrice: 32000,
        rating: 4.9,
        reviews: 310,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        tags: ['Himalayan Bikes', 'Khardung La', 'Camping'],
        isPopular: true,
      },
      {
        id: '6',
        title: 'Manali Snow Treks & Solang Rafting Special',
        location: 'Manali, India',
        duration: '5 Days / 4 Nights',
        price: 16999,
        originalPrice: 22000,
        rating: 4.8,
        reviews: 245,
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
        tags: ['River Rafting', 'Paragliding', 'Solang Valley'],
      },
      {
        id: '7',
        title: 'Kedarkantha Winter Peak Summit Trek',
        location: 'Uttarakhand',
        duration: '6 Days / 5 Nights',
        price: 11999,
        originalPrice: 15500,
        rating: 4.9,
        reviews: 420,
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
        tags: ['Snow Summit', 'Forest Camps', 'All Meals'],
        isPopular: true,
      },
      {
        id: '8',
        title: 'Spiti Valley SUV Safari & High Pass Circuit',
        location: 'Spiti, Himachal',
        duration: '8 Days / 7 Nights',
        price: 29999,
        originalPrice: 38000,
        rating: 4.9,
        reviews: 178,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
        tags: ['Key Monastery', '4x4 SUV', 'Homestays'],
      },
    ],
  },
  honeymoon: {
    name: 'Honeymoon & Romance',
    emoji: '💑',
    tagline: 'Unforgettable romantic getaways, private infinity pools & sunset beachfront dinners',
    heroImage: 'https://images.unsplash.com/photo-1626970356891-a6339d8eece6?w=1600&q=80',
    primaryColor: '#ec4899',
    gradient: 'from-rose-600 via-pink-600 to-fuchsia-700',
    badgeBg: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-400/30',
    accentText: 'text-rose-600 dark:text-rose-400',
    highlights: ['Private Pool Villas', 'Romantic Candlelight Dinners', 'Couples Spa Sessions', 'Complimentary Honeymoon Cake'],
    packages: [
      {
        id: '9',
        title: 'Romantic Maldives Sunset Villa & Spa Special',
        location: 'Maldives',
        duration: '5 Days / 4 Nights',
        price: 94999,
        originalPrice: 120000,
        rating: 5.0,
        reviews: 180,
        image: 'https://images.unsplash.com/photo-1626970356891-a6339d8eece6?w=800&q=80',
        tags: ['Candlelight Dinner', 'Flower Decor', 'Water Villa'],
        isPopular: true,
      },
      {
        id: '10',
        title: 'Manali Couple Snow Paradise Honeymoon',
        location: 'Manali, India',
        duration: '6 Days / 5 Nights',
        price: 19999,
        originalPrice: 26000,
        rating: 4.8,
        reviews: 260,
        image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&q=80',
        tags: ['Private Cab', 'Honeymoon Suite', 'Sightseeing'],
      },
      {
        id: '11',
        title: 'Bali Private Pool Villa & Flower Bath Romance',
        location: 'Bali, Indonesia',
        duration: '6 Days / 5 Nights',
        price: 39999,
        originalPrice: 48000,
        rating: 4.9,
        reviews: 195,
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80',
        tags: ['Ubud Villa', 'Couples Spa', 'Sunset Cruise'],
        isPopular: true,
      },
      {
        id: '12',
        title: 'Kashmir Valley Romantic Houseboat & Snow Retreat',
        location: 'Kashmir, India',
        duration: '6 Days / 5 Nights',
        price: 28999,
        originalPrice: 36000,
        rating: 4.9,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&q=80',
        tags: ['Shikara Ride', 'Gulmarg Snow', 'Dal Lake Stay'],
      },
    ],
  },
  heritage: {
    name: 'Heritage & Culture',
    emoji: '👑',
    tagline: 'Imperial palaces, regal stone forts & rich royal cultural heritage',
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80',
    primaryColor: '#d97706',
    gradient: 'from-amber-600 via-orange-600 to-yellow-700',
    badgeBg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400/30',
    accentText: 'text-amber-600 dark:text-amber-400',
    highlights: ['Heritage Palace Hotels', 'Guided Fort Tours', 'Folk Music & Cultural Shows', 'Royal Dining Experience'],
    packages: [
      {
        id: '13',
        title: 'Royal Rajasthan Forts & Palaces Expedition',
        location: 'Jaipur & Udaipur',
        duration: '7 Days / 6 Nights',
        price: 29999,
        originalPrice: 38000,
        rating: 4.9,
        reviews: 215,
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
        tags: ['Heritage Stays', 'Amber Fort', 'Desert Safari'],
        isPopular: true,
      },
      {
        id: '14',
        title: 'Varanasi Spiritual Ghats & Heritage Walk',
        location: 'Varanasi, India',
        duration: '4 Days / 3 Nights',
        price: 12999,
        originalPrice: 17000,
        rating: 4.8,
        reviews: 175,
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
        tags: ['Ganga Aarti', 'Boat Ride', 'Sarnath Tour'],
      },
      {
        id: '15',
        title: 'Golden Triangle Delhi Jaipur Agra Express',
        location: 'Delhi-Agra-Jaipur',
        duration: '5 Days / 4 Nights',
        price: 18999,
        originalPrice: 24000,
        rating: 4.8,
        reviews: 340,
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
        tags: ['Taj Mahal Sunrise', 'City Palace', 'Private AC Car'],
      },
    ],
  },
  pilgrimage: {
    name: 'Pilgrimage & Sacred',
    emoji: '🕌',
    tagline: 'Soulful spiritual yatras, ancient holy circuits & peace-restoring shrines',
    heroImage: 'https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?w=1600&q=80',
    primaryColor: '#eab308',
    gradient: 'from-amber-500 via-yellow-600 to-orange-600',
    badgeBg: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-400/30',
    accentText: 'text-yellow-600 dark:text-yellow-400',
    highlights: ['VIP Darshan Assistance', 'Pure Vegetarian Meals', 'Comfortable Transfers', 'Experienced Yatra Escorts'],
    packages: [
      {
        id: '16',
        title: 'Char Dham Yatra VIP Darshan & Deluxe Transfers',
        location: 'Uttarakhand',
        duration: '9 Days / 8 Nights',
        price: 45000,
        originalPrice: 55000,
        rating: 5.0,
        reviews: 520,
        image: 'https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?w=800&q=80',
        tags: ['Kedarnath', 'Badrinath', 'VIP Entry'],
        isPopular: true,
      },
      {
        id: '17',
        title: 'Vaishno Devi & Shiv Khori Sacred Circuit',
        location: 'Katra, Jammu',
        duration: '4 Days / 3 Nights',
        price: 8999,
        originalPrice: 12000,
        rating: 4.9,
        reviews: 410,
        image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&q=80',
        tags: ['Helicopter Option', 'Hotel Stay', 'Parcha Pass'],
      },
      {
        id: '18',
        title: 'Kashi Vishwanath & Ayodhya Ram Mandir Yatra',
        location: 'UP, India',
        duration: '5 Days / 4 Nights',
        price: 14500,
        originalPrice: 19000,
        rating: 4.9,
        reviews: 380,
        image: 'https://images.unsplash.com/photo-1545232979-fbf68fe9f1a5?w=800&q=80',
        tags: ['Ram Mandir', 'Kashi Corridor', 'Aarti Sightseeing'],
      },
    ],
  },
  default: {
    name: 'Curated Travel Theme',
    emoji: '✈️',
    tagline: 'Handpicked holiday packages, exclusive experiences & unbeatable prices',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80',
    primaryColor: '#6366f1',
    gradient: 'from-indigo-600 via-purple-600 to-blue-700',
    badgeBg: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-400/30',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    highlights: ['Best Price Guarantee', '100% Verified Stays', 'Flexible Dates', '24/7 Dedicated Support'],
    packages: [
      {
        id: '19',
        title: 'Himachal Complete Family Vacation Special',
        location: 'Shimla & Manali',
        duration: '7 Days / 6 Nights',
        price: 26999,
        originalPrice: 35000,
        rating: 4.8,
        reviews: 310,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
        tags: ['Family Fun', 'Snow Solang', 'Private Vehicle'],
        isPopular: true,
      },
      {
        id: '20',
        title: 'Singapore & Sentosa Island Fun Family Tour',
        location: 'Singapore',
        duration: '5 Days / 4 Nights',
        price: 49999,
        originalPrice: 62000,
        rating: 4.9,
        reviews: 240,
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
        tags: ['Universal Studios', 'Night Safari', 'Marina Bay'],
      },
      {
        id: '21',
        title: 'Kerala Family Houseboat & Tea Gardens Retreat',
        location: 'Kerala, India',
        duration: '6 Days / 5 Nights',
        price: 24500,
        originalPrice: 31000,
        rating: 4.8,
        reviews: 190,
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
        tags: ['Munnar Hills', 'Alleppey Cruise', 'Elephant Park'],
      },
    ],
  },
};

export function ThemeDetail() {
  const params = useParams();
  const rawId = (params?.id || 'beach').toString();
  const { mode, color, themeConfig } = useTheme();

  const [profile, setProfile]                 = useState<ThemeProfile>(THEME_PROFILES.default);
  const [realPackages, setRealPackages]       = useState<ThemeProfile['packages']>([]);
  const [pkgsLoading, setPkgsLoading]         = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [inquiryName, setInquiryName]       = useState('');
  const [inquiryPhone, setInquiryPhone]     = useState('');

  // ── Load theme profile metadata (hero image, tagline etc.) ───────────────
  useEffect(() => {
    const matchedKey = Object.keys(THEME_PROFILES).find(k =>
      k !== 'default' && rawId.toLowerCase().includes(k)
    ) || 'default';
    setProfile(THEME_PROFILES[matchedKey] || THEME_PROFILES.default);
  }, [rawId]);

  // ── Load real packages from DB filtered by packageType ───────────────────
  useEffect(() => {
    setPkgsLoading(true);
    fetch('/api/packages')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const all: any[] = data.data.filter((p: any) => p.isActive !== false);
          // Filter by packageType matching the URL slug
          const matchType = all.filter((p: any) =>
            p.packageType && p.packageType.toLowerCase().includes(rawId.toLowerCase())
          );
          const source = matchType.length > 0 ? matchType : all;
          setRealPackages(source.map((p: any) => ({
            id: p._id,
            title: p.title,
            location: p.location || '',
            duration: p.duration || '',
            price: p.discountedPrice || p.originalPrice || 0,
            originalPrice: p.originalPrice || 0,
            rating: 4.8,
            reviews: 0,
            image: p.imageUrl1 || p.imageUrl2 || THEME_PROFILES.default.heroImage,
            tags: p.badges || [],
            isPopular: p.isTrending,
            category: p.category,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setPkgsLoading(false));
  }, [rawId]);

  const handleCustomInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      toast.error('Please enter your name and phone number');
      return;
    }
    toast.success(`Thank you ${inquiryName}! Our ${profile.name} specialist will call you shortly.`);
    setInquiryName('');
    setInquiryPhone('');
  };

  const packagesList = realPackages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === 'domestic') return matchesSearch && (p as any).category === 'domestic';
    if (selectedFilter === 'international') return matchesSearch && (p as any).category === 'international';
    return matchesSearch;
  });



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans antialiased transition-colors duration-300 selection:bg-[var(--theme-primary)] selection:text-white">
      <Topbar />
      <Navbar />

      {/* ── Theme Hero Banner ───────────────────────────────────────────── */}
      <div className="relative min-h-[480px] md:min-h-[540px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={profile.heroImage}
            alt={profile.name}
            className="w-full h-full object-cover transform scale-105 filter brightness-75"
          />
          {/* Dynamic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-black/40" />
          <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ background: 'var(--theme-gradient)' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-16">
          <Link
            href="/#themes"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to All Themes
          </Link>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl md:text-5xl">{profile.emoji}</span>
            <span
              className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border backdrop-blur-md text-white border-white/30"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              Curated Theme Collection
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-md">
            {profile.name}
          </h1>

          <p className="text-base md:text-xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed mb-8">
            {profile.tagline}
          </p>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 border-t border-white/15">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="block text-xl font-bold text-white">{pkgsLoading ? '...' : `${realPackages.length}+`}</span>
              <span className="text-[11px] text-gray-300">Verified Packages</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="block text-xl font-bold text-white">100%</span>
              <span className="text-[11px] text-gray-300">Customizable</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="block text-xl font-bold text-white">4.9 ★</span>
              <span className="text-[11px] text-gray-300">Guest Rating</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="block text-xl font-bold text-white">24/7</span>
              <span className="text-[11px] text-gray-300">On-Trip Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Container ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

        {/* ── Theme Highlights Pills ───────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            <Sparkles className="w-4 h-4 text-[var(--theme-primary)]" />
            <span>Theme Highlights &amp; Inclusions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[var(--theme-primary)]">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Search & Filter Controls ────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm transition-colors">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search destination or package..."
              className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'text-white shadow-md font-bold'
                  : 'bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800'
              }`}
              style={selectedFilter === 'all' ? { background: 'var(--theme-gradient)' } : {}}
            >
              All Packages ({profile.packages.length})
            </button>
            <button
              onClick={() => setSelectedFilter('domestic')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedFilter === 'domestic'
                  ? 'text-white shadow-md font-bold'
                  : 'bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800'
              }`}
              style={selectedFilter === 'domestic' ? { background: 'var(--theme-gradient)' } : {}}
            >
              🇮🇳 Domestic
            </button>
            <button
              onClick={() => setSelectedFilter('international')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedFilter === 'international'
                  ? 'text-white shadow-md font-bold'
                  : 'bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800'
              }`}
              style={selectedFilter === 'international' ? { background: 'var(--theme-gradient)' } : {}}
            >
              🌎 International
            </button>
          </div>
        </div>

        {/* ── Packages Grid ──────────────────────────────────────────────── */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>Handpicked {profile.name} Packages</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">({packagesList.length} available)</span>
          </h2>

          {packagesList.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-16 text-center text-gray-500 dark:text-gray-400">
              No packages match your search filter. Try clearing filters.
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${packagesList.length === 1 ? 'justify-items-center' : ''}`}>
              {packagesList.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-[var(--theme-primary)]/50 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 ${packagesList.length === 1 ? 'w-full max-w-[340px] sm:max-w-md mx-auto' : ''}`}
                >
                  {/* Package Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Badge */}
                    {pkg.isPopular && (
                      <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                        Popular
                      </span>
                    )}

                    {/* Location Pill */}
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--theme-secondary)]" />
                      {pkg.location}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {pkg.duration}
                        </span>
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {pkg.rating} ({pkg.reviews})
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[var(--theme-primary)] transition-colors line-clamp-2 leading-snug">
                        {pkg.title}
                      </h3>

                      {/* Tag Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {pkg.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Footer */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-medium">Starting from</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-gray-900 dark:text-white">₹{pkg.price.toLocaleString('en-IN')}</span>
                          {pkg.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsPlanModalOpen(true)}
                          className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          Enquire
                        </button>
                        <Link
                          href={`/package/${pkg.id}`}
                          className="px-3.5 py-2 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-md hover:opacity-90 active:scale-95"
                          style={{ background: 'var(--theme-gradient)' }}
                        >
                          Details
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Custom Theme Inquiry Section ───────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-sm transition-colors">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--theme-primary)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] border border-[var(--theme-primary)]/30 inline-block mb-3">
                Tailor-Made Experience
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Want a Customized {profile.name} Itinerary?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                Tell us your travel dates, budget, and preferences. Our travel experts will design a 100% custom itinerary just for you within 2 hours!
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Free Consultation</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Instant Call Back</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <Award className="w-4 h-4 text-[var(--theme-primary)]" />
                  <span>Best Price Guarantee</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <form onSubmit={handleCustomInquiry} className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={e => setInquiryName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={inquiryPhone}
                  onChange={e => setInquiryPhone(e.target.value)}
                  placeholder="e.g. +91 7289037447"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg hover:opacity-95 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                style={{ background: "var(--theme-gradient)" }}
              >
                <PhoneCall className="w-4 h-4" />
                Request Custom Quote
              </button>
            </form>
          </div>
        </div>

      </div>

      <Footer />
      <ChatbotButton />

      {/* Plan Tour Modal */}
      <PlanTourModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
      />
    </div>
  );
}
