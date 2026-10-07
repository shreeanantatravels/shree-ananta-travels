import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContentSection extends Document {
  sectionType: 'whyus' | 'faq' | 'travel_theme' | 'destination' | 'custom';
  title: string;
  content?: string;
  items: Array<{
    label: string;
    value?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
  }>;
  imageUrl?: string;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSectionSchema = new Schema<IContentSection>(
  {
    sectionType: {
      type: String,
      enum: ['whyus', 'faq', 'travel_theme', 'destination', 'custom'],
      required: [true, 'Section type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    items: {
      type: [
        {
          label: { type: String, required: true },
          value: String,
          description: String,
          icon: String,
          isActive: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    position: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ContentSectionSchema.index({ sectionType: 1 });
ContentSectionSchema.index({ position: 1 });

const ContentSection: Model<IContentSection> =
  mongoose.models.ContentSection || mongoose.model<IContentSection>('ContentSection', ContentSectionSchema);

export default ContentSection;
