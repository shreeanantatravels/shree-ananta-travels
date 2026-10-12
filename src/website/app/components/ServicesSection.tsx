"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Plane, Building, Map, Ship, FileText, Compass, Gem, Mountain, Users, Sunrise, Sparkles, Award } from 'lucide-react';

export const SERVICES_DATA = [
  {
    id: "customized-consultancy",
    title: "Customized Travel Consultancy",
    tag: "Travel",
    shortDesc: "Tailored travel plans for individuals, families, and groups. Luxury, budget, or spiritual — we craft every journey to your needs.",
    fullDesc: "Tailored travel plans for individuals, families, and groups. Luxury, budget, or spiritual — we craft every journey to your needs.",
    icon: Compass,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=75&w=600&auto=format&fit=crop"
  },
  {
    id: "spiritual-yatra",
    title: "Spiritual Yatra & Pilgrimage",
    tag: "Yatra",
    shortDesc: "Char Dham, Kailash Mansarovar, Amarnath, Vaishno Devi — organized group & self-guided spiritual yatras with complete support.",
    fullDesc: "Char Dham, Kailash Mansarovar, Amarnath, Vaishno Devi — organized group & self-guided spiritual yatras with complete support.",
    icon: Sunrise,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=75&w=600&auto=format&fit=crop"
  },
  {
    id: "group-management",
    title: "Group Travel Management",
    tag: "Groups",
    shortDesc: "Corporate trips, family groups, religious gatherings — seamless logistics, accommodation, and transport for groups of any size.",
    fullDesc: "Corporate trips, family groups, religious gatherings — seamless logistics, accommodation, and transport for groups of any size. We also curate our own groups for solo travellers and small group travellers.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=75&w=600&auto=format&fit=crop"
  },
  {
    id: "business-consultancy",
    title: "Business & Exhibition Consultancy",
    tag: "Business",
    shortDesc: "Visa assistance, exhibition participation, trade show management, and end-to-end business travel support for corporates.",
    fullDesc: "Visa assistance, exhibition participation, trade show management, and end-to-end business travel support for corporates.",
    icon: Building,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=75&w=600&auto=format&fit=crop"
  },
  {
    id: "events-conference",
    title: "Events & Conference Bookings",
    tag: "Events",
    shortDesc: "Full event management for exhibitions, promotional exhibitions and launches, cultural events.",
    fullDesc: "Full event management for exhibitions, promotional exhibitions and launches, cultural events.",
    icon: Award,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=75&w=600&auto=format&fit=crop"
  },
  {
    id: "spiritual-event-services",
    title: "Spiritual Event Services",
    tag: "Spiritual",
    shortDesc: "Helps in organizing spiritual events as per your need in different countries, end-to-end management.",
    fullDesc: "Helps in organizing spiritual events as per your need in different countries, end-to-end management.",
    icon: Gem,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=75&w=600&auto=format&fit=crop"
  },
  {
    id: "logistics-booking",
    title: "Logistics & Land Services Support",
    tag: "Logistics",
    shortDesc: "Hotels, trains, buses, taxis — we handle all logistics needs end-to-end so you focus entirely on your journey.",
    fullDesc: "Hotels, trains, buses, taxis — we handle all logistics needs end-to-end so you focus entirely on your journey.",
    icon: Map,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000"
  },
  {
    id: "visa-documentation",
    title: "Visa Services & Documentation",
    tag: "Visa",
    shortDesc: "Tourist visas, business visas, pilgrimage permits — expert guidance for hassle-free documentation and approvals.",
    fullDesc: "Tourist visas, business visas, pilgrimage permits — expert guidance for hassle-free documentation and approvals.",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000"
  },
  {
    id: "air-tickets",
    title: "Air Tickets & Flight Bookings",
    tag: "Flights",
    shortDesc: "Instant online reservations for available seats on Domestic and International flights with exclusive deals.",
    fullDesc: "Instant online reservations for available seats on Domestic and International flights with exclusive deals.",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000"
  },
  {
    id: "luxury-hotels",
    title: "Hotels & Resorts",
    tag: "Hotels",
    shortDesc: "Handpicked luxury stays, premium resorts, and comfortable accommodations tailored to your preference.",
    fullDesc: "Reliable and instant confirmation of hotels across domestic and international destinations. All categories of hotels and resorts are available.",
    icon: Building,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000"
  },
  {
    id: "cruise-holidays",
    title: "Cruise Holidays",
    tag: "Cruises",
    shortDesc: "Luxury ocean and river cruises around the globe with all-inclusive onboard amenities and offshore excursions.",
    fullDesc: "We offer a range of cruise holiday deals to destinations all over the world. From exploring the cobbled streets of Venice, to basking in the Caribbean sun.",
    icon: Ship,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1000"
  },
  {
    id: "luxury-travel",
    title: "Luxury Travel",
    tag: "Luxury",
    shortDesc: "For those seeking unparalleled luxury and opulence, extraordinary travel experiences that combine refinement with comfort.",
    fullDesc: "For those seeking unparalleled luxury and opulence, we craft extraordinary travel experiences that combine refinement with comfort.",
    icon: Gem,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000"
  },
  {
    id: "adventure-expeditions",
    title: "Adventure and Expeditions",
    tag: "Adventure",
    shortDesc: "For adventurous spirits, adrenaline-pumping expeditions to remote and awe-inspiring locations around the globe.",
    fullDesc: "For the adventurous spirits, we curate adrenaline-pumping expeditions to remote and awe-inspiring locations around the globe. From trekking through dense jungles to scaling peaks.",
    icon: Mountain,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000"
  },
  {
    id: "cultural-immersion",
    title: "Cultural Immersion",
    tag: "Cultural",
    shortDesc: "Authentic cultural experiences, unique homestays, and community interactions in rich historical regions.",
    fullDesc: "We believe that traveling is a window into a world of diverse cultures and traditions. To foster authentic cultural experiences, we organize unique homestays and community interactions.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1000"
  }
];

export function ServicesSection() {
  // Show first 6 on homepage
  const displayedServices = SERVICES_DATA.slice(0, 6);

  return (
    <section id="services" className="pt-6 pb-16 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-extrabold uppercase tracking-widest mb-4 border border-[var(--theme-primary)]/20 shadow-xs">
              <span>What We Offer</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--theme-gradient)' }}>Services</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover a wide range of premium travel services tailored to provide you with the most comfortable and memorable experiences.
            </p>
          </div>
          <Link href="/services" className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group flex-shrink-0">
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="group relative h-[250px] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col items-center justify-center text-center px-4 py-6 border border-gray-100/10">
                {/* Background Image */}
                <img 
                  src={service.image} 
                  alt={service.title} 
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={250}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=75&w=600&auto=format&fit=crop';
                  }}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 group-hover:opacity-100 opacity-90 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-500" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[var(--theme-primary)] group-hover:border-transparent">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>{service.title}</h3>
                  <div className="w-8 h-0.5 bg-[var(--theme-primary)] rounded-full mb-3 group-hover:w-16 transition-all duration-300"></div>
                  <p className="text-gray-200 text-xs md:text-sm line-clamp-3 leading-relaxed font-medium px-2 group-hover:text-white transition-colors">{service.shortDesc}</p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
