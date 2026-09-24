export type EmergencyType =
  | 'cardiac'
  | 'accident'
  | 'breathing'
  | 'stroke'
  | 'burn'
  | 'critical'
  | 'pediatric'
  | 'general'
  | 'other';

export type HospitalType =
  | 'government'
  | 'private'
  | 'trust'
  | 'multispecialty'
  | 'specialty';

export type EmergencyStatus = 'active' | 'limited' | 'unavailable';
export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

export interface Beds {
  total: number;
  available: number;
}

export interface ICU {
  total: number;
  available: number;
}

export interface Equipment {
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
}

export interface Specialists {
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
}

export interface Hospital {
  _id: string;
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
  hospitalType: HospitalType;
  emergencyStatus: EmergencyStatus;
  beds: Beds;
  icu: ICU;
  equipment: Equipment;
  specialists: Specialists;
  ambulance: boolean;
  is24x7: boolean;
  lastUpdated: string;
  createdAt: string;
  images?: string[];
  rating?: number;
  establishedYear?: number;
  accreditation?: string;
  adminId?: string;
}

export interface HospitalWithDistance extends Hospital {
  distance: number; // in km
  estimatedTime: number; // in minutes
  suitabilityScore: number;
  matchReasons: string[];
}

export interface SearchParams {
  emergencyType: EmergencyType;
  latitude: number;
  longitude: number;
  maxDistance?: number;
  filters?: {
    icuAvailable?: boolean;
    ventilatorAvailable?: boolean;
    emergencyActive?: boolean;
    ambulanceAvailable?: boolean;
    is24x7?: boolean;
    hospitalType?: HospitalType;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'HOSPITAL_ADMIN' | 'AUTHORITY';
  hospitalId?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}
