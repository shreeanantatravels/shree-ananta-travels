import mongoose, { Schema, Document, Model } from 'mongoose';


export interface IDestinationData {
  name: string;
  category: 'domestic' | 'international';
  active: boolean;
  trending: boolean;
  image: string;
  showInNavbar?: boolean;
}

export interface ISiteConfig extends Document {
  // Singleton marker — only one document exists
  _singleton: true;
  companyName: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  defaultWhatsappMessage: string;
  currency: string;
  timezone: string;
  heroBadge?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImages?: string[];
    navLinks?: {
      id: string;
      label: string;
      url: string;
      isActive: boolean;
      canDelete: boolean;
      order: number;
    }[];
    topbarOffer: {
    text: string;
    ctaText: string;
    ctaLink: string;
    isActive: boolean;
  };
  cardOffer: {
    text: string;
    bgColor: string;
    isActive: boolean;
  };
  destinations: IDestinationData[];
  createdAt: Date;
  updatedAt: Date;
}

const SiteConfigSchema = new Schema<ISiteConfig>(
  {
    _singleton: { type: Boolean, default: true, unique: true },
    companyName: { type: String, trim: true, default: 'Shree Ananta Travels' },
    logoUrl: { type: String, default: '' },
    contactEmail: { type: String, trim: true, default: '' },
    contactPhone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    facebookUrl: { type: String, trim: true, default: '' },
    instagramUrl: { type: String, trim: true, default: '' },
    defaultWhatsappMessage: { type: String, default: 'Hi, I would like to enquire about your travel packages.' },
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'IST' },
    heroBadge: { type: String, default: '' },
    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },
    heroImages: { type: [String], default: [] },
    navLinks: {
      type: [
        {
          id: { type: String, required: true },
          label: { type: String, required: true },
          url: { type: String, required: true },
          isActive: { type: Boolean, default: true },
          canDelete: { type: Boolean, default: true },
          order: { type: Number, default: 0 },
        }
      ],
      default: []
    },
    topbarOffer: {
      text: { type: String, default: '' },
      ctaText: { type: String, default: '' },
      ctaLink: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
    },
    cardOffer: {
      text: { type: String, default: '' },
      bgColor: { type: String, default: 'red' },
      isActive: { type: Boolean, default: false },
    },
    destinations: {
      type: [
        {
          name: { type: String, required: true },
          category: { type: String, enum: ['domestic', 'international'], default: 'domestic' },
          active: { type: Boolean, default: true },
          trending: { type: Boolean, default: false },
          image: { type: String, default: '' },
          showInNavbar: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

delete (mongoose.models as any).SiteConfig;
const SiteConfig: Model<ISiteConfig> =
  mongoose.models.SiteConfig || mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);

export default SiteConfig;
