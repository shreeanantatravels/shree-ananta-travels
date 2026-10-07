import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
  customerName: string;
  destination?: string;
  rating: number;
  review: string;
  avatarUrl?: string;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
    },
    avatarUrl: {
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

TestimonialSchema.index({ position: 1 });
TestimonialSchema.index({ isActive: 1 });

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
