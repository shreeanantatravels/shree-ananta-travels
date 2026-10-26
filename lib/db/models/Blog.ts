import mongoose, { Schema, Document, Model } from 'mongoose';

export type BlogStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface IBlogSEO {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface IBlogFAQ {
  question: string;
  answer: string;
}

export interface IBlogSocialSharing {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  author: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  subcategorySlug?: string;
  status: BlogStatus;
  isFeatured: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  readTime: number;
  tags: string[];
  faq: IBlogFAQ[];
  seo: IBlogSEO;
  socialSharing: IBlogSocialSharing;
  redirectFromSlugs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      default: '',
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
      trim: true,
    },
    coverImageAlt: {
      type: String,
      default: '',
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      default: 'Shree Ananta Travels Editorial Desk',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    categorySlug: {
      type: String,
      required: [true, 'Category slug is required'],
      trim: true,
      lowercase: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    subcategorySlug: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      index: true,
    },
    scheduledAt: {
      type: Date,
      index: true,
    },
    readTime: {
      type: Number,
      default: 3,
    },
    tags: {
      type: [String],
      default: [],
    },
    faq: {
      type: [
        {
          question: { type: String, trim: true, default: '' },
          answer: { type: String, trim: true, default: '' },
        },
      ],
      default: [],
    },
    seo: {
      title: { type: String, trim: true, default: '' },
      description: { type: String, trim: true, default: '' },
      canonicalUrl: { type: String, trim: true, default: '' },
      noIndex: { type: Boolean, default: false },
    },
    socialSharing: {
      ogTitle: { type: String, trim: true, default: '' },
      ogDescription: { type: String, trim: true, default: '' },
      ogImage: { type: String, trim: true, default: '' },
    },
    redirectFromSlugs: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

BlogSchema.index({ categorySlug: 1, status: 1 });
BlogSchema.index({ subcategorySlug: 1, status: 1 });
BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ isFeatured: 1, status: 1 });
BlogSchema.index({ redirectFromSlugs: 1 });

if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
