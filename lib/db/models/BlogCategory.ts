import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogSubcategory {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  heading?: string;
  description?: string;
  subcategories: IBlogSubcategory[];
  order: number;
  isActive: boolean;
  showInNavbar: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSubcategorySchema = new Schema<IBlogSubcategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const BlogCategorySchema = new Schema<IBlogCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    heading: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    subcategories: {
      type: [BlogSubcategorySchema],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showInNavbar: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

BlogCategorySchema.index({ order: 1 });
BlogCategorySchema.index({ isActive: 1 });
BlogCategorySchema.index({ showInNavbar: 1 });

if (mongoose.models.BlogCategory) {
  delete mongoose.models.BlogCategory;
}

const BlogCategory: Model<IBlogCategory> =
  mongoose.models.BlogCategory || mongoose.model<IBlogCategory>('BlogCategory', BlogCategorySchema);

export default BlogCategory;
