import mongoose, { Schema, Document } from 'mongoose';

export interface IHospital extends Document {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergencyPhone: string;
  email: string;
  website?: string;
  hospitalType: 'government' | 'private' | 'trust' | 'multispecialty' | 'specialty';
  emergencyStatus: 'active' | 'limited' | 'unavailable';
  beds: { total: number; available: number };
  icu: { total: number; available: number };
  equipment: {
    ventilator: boolean;
    ctScan: boolean;
    mri: boolean;
    xray: boolean;
    ecg: boolean;
    defibrillator: boolean;
    dialysis: boolean;
    oxygen: boolean;
    bloodBank: boolean;
    operationTheater: boolean;
  };
  specialists: {
    cardiologist: boolean;
    neurologist: boolean;
    orthopedic: boolean;
    pulmonologist: boolean;
    pediatrician: boolean;
    traumaSurgeon: boolean;
    generalSurgeon: boolean;
    anesthesiologist: boolean;
    radiologist: boolean;
    intensivist: boolean;
    burnSpecialist: boolean;
    ophthalmologist: boolean;
  };
  ambulance: boolean;
  is24x7: boolean;
  adminId?: mongoose.Types.ObjectId;
  images?: string[];
  rating?: number;
  establishedYear?: number;
  accreditation?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSchema = new Schema<IHospital>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: { type: String, required: true },
    emergencyPhone: { type: String, required: true },
    email: { type: String },
    website: { type: String },
    hospitalType: {
      type: String,
      enum: ['government', 'private', 'trust', 'multispecialty', 'specialty'],
      default: 'multispecialty',
    },
    emergencyStatus: {
      type: String,
      enum: ['active', 'limited', 'unavailable'],
      default: 'active',
    },
    beds: {
      total: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
    },
    icu: {
      total: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
    },
    equipment: {
      ventilator: { type: Boolean, default: false },
      ctScan: { type: Boolean, default: false },
      mri: { type: Boolean, default: false },
      xray: { type: Boolean, default: false },
      ecg: { type: Boolean, default: false },
      defibrillator: { type: Boolean, default: false },
      dialysis: { type: Boolean, default: false },
      oxygen: { type: Boolean, default: false },
      bloodBank: { type: Boolean, default: false },
      operationTheater: { type: Boolean, default: false },
    },
    specialists: {
      cardiologist: { type: Boolean, default: false },
      neurologist: { type: Boolean, default: false },
      orthopedic: { type: Boolean, default: false },
      pulmonologist: { type: Boolean, default: false },
      pediatrician: { type: Boolean, default: false },
      traumaSurgeon: { type: Boolean, default: false },
      generalSurgeon: { type: Boolean, default: false },
      anesthesiologist: { type: Boolean, default: false },
      radiologist: { type: Boolean, default: false },
      intensivist: { type: Boolean, default: false },
      burnSpecialist: { type: Boolean, default: false },
      ophthalmologist: { type: Boolean, default: false },
    },
    ambulance: { type: Boolean, default: false },
    is24x7: { type: Boolean, default: false },
    adminId: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String }],
    rating: { type: Number, min: 0, max: 5 },
    establishedYear: { type: Number },
    accreditation: { type: String },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Geospatial index
HospitalSchema.index({ latitude: 1, longitude: 1 });
HospitalSchema.index({ city: 1 });
HospitalSchema.index({ emergencyStatus: 1 });

export const Hospital =
  mongoose.models.Hospital || mongoose.model<IHospital>('Hospital', HospitalSchema);
export default Hospital;
