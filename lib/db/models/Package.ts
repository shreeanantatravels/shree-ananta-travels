import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  city?: string;
  route?: string;
  altitude?: string;
  stay?: string;
  meals?: string;
  transport?: string;
}

export interface IRegistrationStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface IPackageSEO {
  title?: string;
  description?: string;
  focusKeyword?: string;
  relatedKeywords?: string[];
}

export interface IPackage extends Document {
  title: string;
  slug: string;
  description: string;
  location: string;
  duration: string;
  category: 'domestic' | 'international' | 'kailash';
  packageType: string;
  originalPrice: number;
  discountedPrice?: number;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  isActive: boolean;
  isTrending: boolean;
  hasOffer: boolean;
  badges: string[];
  tags: string[];
  route?: string;
  departure?: string;
  tourStyle?: string;
  routeBannerTitle?: string;
  routeBannerSubtitle?: string;
  registrationTitle?: string;
  registrationSteps?: IRegistrationStep[];
  travelEssentialsTitle?: string;
  travelEssentialsSubtitle?: string;
  travelEssentials?: string[];
  trustFeatures?: string[];
  conciergeTitle?: string;
  conciergeSubtitle?: string;
  seo: IPackageSEO;
  redirectFromSlugs: string[];
  enableRouteMap?: boolean;
  enableAltitude?: boolean;
  inclusions: string[];
  exclusions: string[];
  termsAndConditions: string[];
  itinerary: IItineraryDay[];
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationStepSchema = new Schema<IRegistrationStep>(
  {
    stepNumber: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const ItineraryDaySchema = new Schema<IItineraryDay>({
  dayNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, default: '' },
  route: { type: String, default: '' },
  altitude: { type: String, default: '' },
  stay: { type: String, default: '' },
  meals: { type: String, default: '' },
  transport: { type: String, default: '' },
});

const PackageSchema = new Schema<IPackage>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a package title'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Please provide the duration'],
    },
    category: {
      type: String,
      enum: ['domestic', 'international', 'kailash'],
      required: [true, 'Category is required'],
    },
    packageType: {
      type: String,
      default: 'other',
    },
    originalPrice: {
      type: Number,
      required: [true, 'Please provide the original price'],
    },
    discountedPrice: {
      type: Number,
    },
    imageUrl1: {
      type: String,
      default: '',
    },
    imageUrl2: {
      type: String,
      default: '',
    },
    imageUrl3: {
      type: String,
      default: '',
    },
    imageUrl4: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    hasOffer: {
      type: Boolean,
      default: false,
    },
    badges: {
      type: [String],
      enum: ['bestseller'],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    seo: {
      title: { type: String, trim: true, default: '' },
      description: { type: String, trim: true, default: '' },
      focusKeyword: { type: String, trim: true, default: '' },
      relatedKeywords: { type: [String], default: [] },
    },
    redirectFromSlugs: {
      type: [String],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    termsAndConditions: {
      type: [String],
      default: [],
    },
    route: {
      type: String,
      trim: true,
      default: '',
    },
    departure: {
      type: String,
      trim: true,
      default: '',
    },
    tourStyle: {
      type: String,
      trim: true,
      default: '',
    },
    routeBannerTitle: {
      type: String,
      trim: true,
      default: '',
    },
    routeBannerSubtitle: {
      type: String,
      trim: true,
      default: '',
    },
    registrationTitle: {
      type: String,
      trim: true,
      default: '',
    },
    registrationSteps: {
      type: [RegistrationStepSchema],
      default: [],
    },
    travelEssentialsTitle: {
      type: String,
      trim: true,
      default: '',
    },
    travelEssentialsSubtitle: {
      type: String,
      trim: true,
      default: '',
    },
    travelEssentials: {
      type: [String],
      default: [],
    },
    trustFeatures: {
      type: [String],
      default: [],
    },
    conciergeTitle: {
      type: String,
      trim: true,
      default: '',
    },
    conciergeSubtitle: {
      type: String,
      trim: true,
      default: '',
    },
    enableRouteMap: {
      type: Boolean,
      default: false,
    },
    enableAltitude: {
      type: Boolean,
      default: false,
    },
    itinerary: {
      type: [ItineraryDaySchema],
      default: [],
    },
  },
  { timestamps: true }
);

PackageSchema.index({ slug: 1 }, { unique: true, sparse: true });
PackageSchema.index({ redirectFromSlugs: 1 });
PackageSchema.index({ tags: 1 });
PackageSchema.index({ category: 1 });
PackageSchema.index({ isTrending: 1 });
PackageSchema.index({ isActive: 1 });
PackageSchema.index({ createdAt: -1 });

// Delete cached model to force recompilation in dev mode
if (mongoose.models.Package) {
  delete mongoose.models.Package;
}

const Package: Model<IPackage> = mongoose.model<IPackage>('Package', PackageSchema);

export default Package;
