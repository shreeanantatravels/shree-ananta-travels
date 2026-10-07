import mongoose, { Schema, Document, Model } from 'mongoose';


export type LeadStatus = 'pending' | 'contacted' | 'follow_up' | 'quoted' | 'cancelled';

export interface ILead extends Document {
  // Contact info
  name: string;
  email?: string;
  phone: string;
  // Trip details
  fromLocation?: string;
  toLocation?: string;
  departureDate?: Date;
  numberOfDays?: number;
  adults?: number;
  children?: number;
  // Budget & preferences
  budgetRupees?: string | number;
  hotelBooked?: string;
  hotelType?: string;
  flightBooked?: string;
  mealPlan?: string;
  specialRequests?: string;
  // Package enquiry
  packageName?: string;
  packageId?: string;
  status: LeadStatus;
  dealAmount?: number;
  convertedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    fromLocation: String,
    toLocation: String,
    departureDate: Date,
    numberOfDays: Number,
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    budgetRupees: Schema.Types.Mixed,
    hotelBooked: String,
    hotelType: String,
    flightBooked: String,
    mealPlan: String,
    specialRequests: String,
    packageName: String,
    packageId: String,
    status: {
      type: String,
      enum: ['pending', 'contacted', 'follow_up', 'quoted', 'cancelled'],
      default: 'pending',
    },
    dealAmount: { type: Number, default: 0 },
    convertedAt: Date,
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1 });
LeadSchema.index({ createdAt: -1 });

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
