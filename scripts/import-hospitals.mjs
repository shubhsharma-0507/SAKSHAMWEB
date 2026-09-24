// Import real hospitals from a JSON file into MongoDB.
//
//   npm run import:hospitals -- data/hospitals.json --dry-run   (validate only, no database)
//   npm run import:hospitals -- data/hospitals.json             (write to MongoDB)
//
// Reads MONGODB_URI from .env.local (Node 20.6+ `--env-file`, wired in package.json).
// Beds, ICU, equipment and specialists start at zero/false: only the hospital itself
// knows the real numbers, and it should enter them from the dashboard.
// If a row has adminEmail + adminPassword, a login for that hospital is created too.

import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const file = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
if (!file || file.startsWith('--')) {
  console.error('Usage: npm run import:hospitals -- <file.json> [--dry-run]');
  process.exit(1);
}

const rows = JSON.parse(readFileSync(file, 'utf8'));
if (!Array.isArray(rows)) {
  console.error('The file must contain a JSON array of hospitals.');
  process.exit(1);
}

const TYPES = ['government', 'private', 'trust', 'multispecialty', 'specialty'];
const REQUIRED = ['name', 'address', 'city', 'state', 'phone', 'emergencyPhone', 'latitude', 'longitude'];

function validate(row, i) {
  const problems = [];
  for (const k of REQUIRED) if (row[k] === undefined || row[k] === null || row[k] === '') problems.push(`missing ${k}`);
  const lat = Number(row.latitude), lon = Number(row.longitude);
  if (!Number.isFinite(lat) || Math.abs(lat) > 90) problems.push('latitude must be between -90 and 90');
  if (!Number.isFinite(lon) || Math.abs(lon) > 180) problems.push('longitude must be between -180 and 180');
  if (row.hospitalType && !TYPES.includes(row.hospitalType)) problems.push(`hospitalType must be one of ${TYPES.join(', ')}`);
  if (row.adminEmail && !/^\S+@\S+\.\S+$/.test(row.adminEmail)) problems.push('adminEmail is not a valid email');
  if (row.adminEmail && (!row.adminPassword || row.adminPassword.length < 8)) problems.push('adminPassword must be at least 8 characters');
  return problems.map((p) => `row ${i + 1} (${row.name || 'unnamed'}): ${p}`);
}

const errors = rows.flatMap(validate);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`${rows.length} hospital(s) in ${file} passed validation.`);
if (dryRun) process.exit(0);

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set. Add it to .env.local.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const Hospital = mongoose.connection.collection('hospitals');
const Users = mongoose.connection.collection('users');

let created = 0, updated = 0, admins = 0;
for (const row of rows) {
  const now = new Date();
  const details = {
    name: row.name.trim(),
    description: row.description || '',
    address: row.address.trim(),
    city: row.city.trim(),
    state: row.state.trim(),
    pincode: row.pincode || '',
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    phone: row.phone,
    emergencyPhone: row.emergencyPhone,
    email: row.email || '',
    website: row.website || '',
    hospitalType: row.hospitalType || 'multispecialty',
    accreditation: row.accreditation || '',
    ...(row.establishedYear ? { establishedYear: Number(row.establishedYear) } : {}),
    ambulance: !!row.ambulance,
    is24x7: !!row.is24x7,
    updatedAt: now,
  };

  // Same name + city = same hospital, so re-running the import does not create duplicates.
  const res = await Hospital.findOneAndUpdate(
    { name: details.name, city: details.city },
    {
      $set: details,
      $setOnInsert: {
        emergencyStatus: 'limited',
        beds: { total: 0, available: 0 },
        icu: { total: 0, available: 0 },
        equipment: Object.fromEntries(['ventilator','ctScan','mri','xray','ecg','defibrillator','dialysis','oxygen','bloodBank','operationTheater'].map((k) => [k, false])),
        specialists: Object.fromEntries(['cardiologist','neurologist','orthopedic','pulmonologist','pediatrician','traumaSurgeon','generalSurgeon','anesthesiologist','radiologist','intensivist','burnSpecialist','ophthalmologist'].map((k) => [k, false])),
        lastUpdated: now,
        createdAt: now,
      },
    },
    { upsert: true, returnDocument: 'after' }
  );
  const doc = res.value ?? res;
  if (doc.createdAt && doc.createdAt.getTime?.() === now.getTime()) created++; else updated++;

  if (row.adminEmail) {
    const email = row.adminEmail.trim().toLowerCase();
    if (await Users.findOne({ email })) {
      console.log(`  skipped admin ${email}: already exists`);
    } else {
      const user = await Users.insertOne({
        name: row.adminName || details.name,
        email,
        password: await bcrypt.hash(row.adminPassword, 12),
        role: 'HOSPITAL_ADMIN',
        hospitalId: doc._id,
        createdAt: now,
        updatedAt: now,
      });
      await Hospital.updateOne({ _id: doc._id }, { $set: { adminId: user.insertedId } });
      admins++;
    }
  }
}

console.log(`Done. ${created} created, ${updated} updated, ${admins} admin login(s) created.`);
await mongoose.disconnect();
