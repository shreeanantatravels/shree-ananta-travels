import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import SiteConfig from '@/lib/db/models/SiteConfig';
import { getAuthUserId } from '@/lib/auth';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    let config = await SiteConfig.findOne({ _singleton: true });
    
    if (!config) {
      config = await SiteConfig.create({ _singleton: true });
    }

    const defaultNavLinks = [
      { id: 'kailash', label: 'Kailash Mansarovar', url: '/landing/kailash-mansarovar', isActive: true, canDelete: false, order: 1 },
      { id: 'domestic', label: 'Domestic', url: '/domestic', isDropdown: true, category: 'domestic', isActive: true, canDelete: false, order: 2 },
      { id: 'international', label: 'International', url: '/international', isDropdown: true, category: 'international', isActive: true, canDelete: false, order: 3 },
      { id: 'groups', label: 'Groups', url: '/packages?category=groups', isActive: true, canDelete: false, order: 4 },
      { id: 'spiritual', label: 'Spiritual', url: '/packages?category=spiritual', isActive: true, canDelete: false, order: 5 },
      { id: 'services', label: 'Services', url: '/services', isActive: true, canDelete: false, order: 6 },
      { id: 'trending', label: 'Trending', url: '/packages?category=trending', isActive: true, canDelete: false, order: 7 },
      { id: 'contact', label: 'Contact', url: '/contact', isActive: true, canDelete: false, order: 8 },
    ];

    const hasOldNavDefaults = config.navLinks?.some((l: any) => l.id === 'home' || l.id === 'destinations' || l.id === 'packages');
    if (!config.navLinks || config.navLinks.length === 0 || hasOldNavDefaults) {
      config.navLinks = defaultNavLinks;
      config.markModified('navLinks');
      await config.save();
    } else {
      let updated = false;
      const currentNav = [...config.navLinks];
      defaultNavLinks.forEach(def => {
        if (!currentNav.some((l: any) => l.id === def.id || l.label?.toLowerCase() === def.label.toLowerCase())) {
          currentNav.push(def);
          updated = true;
        }
      });
      if (updated) {
        config.navLinks = currentNav;
        config.markModified('navLinks');
        await config.save();
      }
    }

    if (!config.topbarOffer) {
      config.topbarOffer = {
        text: '',
        ctaText: '',
        ctaLink: '',
        isActive: true,
      };
      config.markModified('topbarOffer');
      await config.save();
    } else if (config.topbarOffer.isActive === undefined || (config.topbarOffer.text && config.topbarOffer.isActive === false)) {
      config.topbarOffer.isActive = true;
      config.markModified('topbarOffer');
      await config.save();
    }

    // Seed or populate destinations with real curated destinations if empty or test data
    const REAL_DESTINATIONS: any[] = [
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

    const hasDummy = config.destinations?.some((d: any) => d.name === 'x' || d.name === 'Bombey' || !d.name);
    const forceReset = new URL(req.url).searchParams.has('seed');
    if (!config.destinations || config.destinations.length < 6 || hasDummy || forceReset) {
      config.destinations = REAL_DESTINATIONS;
      config.markModified('destinations');
    }

    await config.save();

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

    const body = await req.json();
    
    // Ensure we don't mess with the singleton flag
    delete body._singleton;
    delete body._id;

    // Isolated validation: validate contactPhone only if supplied in update payload
    if (body.contactPhone !== undefined && body.contactPhone !== null && body.contactPhone !== '') {
      const cleanPhone = String(body.contactPhone).replace(/[\s\-()]/g, '');
      if (!/^\+?[1-9]\d{9,14}$/.test(cleanPhone)) {
        return NextResponse.json(
          { success: false, message: 'Invalid business phone number. Please provide a valid 10-15 digit number (e.g. +91 7289037447 or 7289037447).' },
          { status: 400 }
        );
      }
    }

    // Isolated validation: validate contactEmail only if supplied in update payload
    if (body.contactEmail !== undefined && body.contactEmail !== null && body.contactEmail !== '') {
      const cleanEmail = String(body.contactEmail).trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return NextResponse.json(
          { success: false, message: 'Invalid business contact email address.' },
          { status: 400 }
        );
      }
    }

    let config = await SiteConfig.findOne({ _singleton: true });
    
    if (!config) {
      config = await SiteConfig.create({ _singleton: true, ...body });
    } else {
      // Find deleted heroImages
      if (body.heroImages && Array.isArray(body.heroImages)) {
        const newImages = body.heroImages;
        const oldImages = config.heroImages || [];
        const deletedImages = oldImages.filter(img => !newImages.includes(img));
        
        for (const imgUrl of deletedImages) {
          await deleteImageFromCloudinary(imgUrl);
        }
      }

      // Handle logoUrl deletion
      if (body.logoUrl !== undefined && body.logoUrl !== config.logoUrl) {
        if (config.logoUrl) await deleteImageFromCloudinary(config.logoUrl);
      }

      // Handle destination images deletion
      if (body.destinations && Array.isArray(body.destinations)) {
        const oldDestinations = config.destinations || [];
        const newDestinations = body.destinations;
        
        const newImages = newDestinations.map((d: any) => d.image).filter(Boolean);
        const oldImages = oldDestinations.map((d: any) => d.image).filter(Boolean);
        
        const deletedImages = oldImages.filter(img => !newImages.includes(img));
        for (const imgUrl of deletedImages) {
          await deleteImageFromCloudinary(imgUrl);
        }
      }

      config = await SiteConfig.findOneAndUpdate(
        { _singleton: true },
        body,
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
