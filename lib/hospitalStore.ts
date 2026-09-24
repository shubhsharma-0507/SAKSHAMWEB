import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import HospitalModel from '@/models/Hospital';
import { Hospital } from '@/types';
import { getDemoHospital, getDemoHospitals, isDemoMode, updateDemoHospital } from '@/lib/demoStore';

/** Turn { beds: { available: 3 } } into { 'beds.available': 3 } so Mongo only touches the given keys. */
function flatten(patch: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const [k2, v2] of Object.entries(v as Record<string, unknown>)) out[`${k}.${k2}`] = v2;
    } else {
      out[k] = v;
    }
  }
  return out;
}

export async function listHospitals(): Promise<Hospital[]> {
  if (isDemoMode()) return getDemoHospitals();
  await connectDB();
  return (await HospitalModel.find({}).lean()) as unknown as Hospital[];
}

export async function findHospital(id: string): Promise<Hospital | null> {
  if (isDemoMode()) return getDemoHospital(id);
  if (!mongoose.isValidObjectId(id)) return null;
  await connectDB();
  return (await HospitalModel.findById(id).lean()) as unknown as Hospital | null;
}

export async function patchHospital(id: string, patch: Record<string, unknown>): Promise<Hospital | null> {
  if (isDemoMode()) return updateDemoHospital(id, patch);
  if (!mongoose.isValidObjectId(id)) return null;
  await connectDB();
  return (await HospitalModel.findByIdAndUpdate(
    id,
    { $set: { ...flatten(patch), lastUpdated: new Date() } },
    { new: true, runValidators: true }
  ).lean()) as unknown as Hospital | null;
}
