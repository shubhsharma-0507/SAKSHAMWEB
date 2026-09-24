import { EmergencyType, HospitalWithDistance, Hospital } from '@/types';

interface EmergencyRequirements {
  specialists: (keyof HospitalWithDistance['specialists'])[];
  equipment: (keyof HospitalWithDistance['equipment'])[];
  needsICU: boolean;
  needsEmergency: boolean;
  needsAmbulance: boolean;
  description: string;
}

const EMERGENCY_REQUIREMENTS: Record<EmergencyType, EmergencyRequirements> = {
  cardiac: {
    specialists: ['cardiologist', 'anesthesiologist', 'intensivist'],
    equipment: ['ecg', 'defibrillator', 'ventilator', 'oxygen'],
    needsICU: true,
    needsEmergency: true,
    needsAmbulance: false,
    description: 'Cardiac Emergency',
  },
  accident: {
    specialists: ['traumaSurgeon', 'orthopedic', 'anesthesiologist', 'generalSurgeon'],
    equipment: ['xray', 'ctScan', 'operationTheater', 'bloodBank', 'oxygen'],
    needsICU: true,
    needsEmergency: true,
    needsAmbulance: true,
    description: 'Accident / Trauma',
  },
  breathing: {
    specialists: ['pulmonologist', 'intensivist', 'anesthesiologist'],
    equipment: ['ventilator', 'oxygen', 'ecg'],
    needsICU: true,
    needsEmergency: true,
    needsAmbulance: false,
    description: 'Breathing Emergency',
  },
  stroke: {
    specialists: ['neurologist', 'intensivist', 'anesthesiologist', 'radiologist'],
    equipment: ['ctScan', 'mri', 'ventilator', 'oxygen'],
    needsICU: true,
    needsEmergency: true,
    needsAmbulance: false,
    description: 'Stroke',
  },
  burn: {
    specialists: ['burnSpecialist', 'generalSurgeon', 'anesthesiologist'],
    equipment: ['operationTheater', 'oxygen', 'bloodBank'],
    needsICU: true,
    needsEmergency: true,
    needsAmbulance: false,
    description: 'Burn Emergency',
  },
  critical: {
    specialists: ['intensivist', 'anesthesiologist', 'generalSurgeon'],
    equipment: ['ventilator', 'oxygen', 'ecg', 'defibrillator'],
    needsICU: true,
    needsEmergency: true,
    needsAmbulance: false,
    description: 'Critical Care',
  },
  pediatric: {
    specialists: ['pediatrician', 'anesthesiologist', 'intensivist'],
    equipment: ['oxygen', 'ventilator', 'ecg'],
    needsICU: true,
    needsEmergency: true,
    needsAmbulance: false,
    description: 'Pediatric Emergency',
  },
  general: {
    specialists: ['generalSurgeon'],
    equipment: ['xray', 'oxygen'],
    needsICU: false,
    needsEmergency: true,
    needsAmbulance: false,
    description: 'General Emergency',
  },
  other: {
    specialists: [],
    equipment: [],
    needsICU: false,
    needsEmergency: true,
    needsAmbulance: false,
    description: 'Other Emergency',
  },
};

const SPECIALIST_LABELS: Record<string, string> = {
  cardiologist: 'Cardiologist available',
  neurologist: 'Neurologist available',
  orthopedic: 'Orthopedic specialist available',
  pulmonologist: 'Pulmonologist available',
  pediatrician: 'Pediatrician available',
  traumaSurgeon: 'Trauma surgeon available',
  generalSurgeon: 'General surgeon available',
  anesthesiologist: 'Anesthesiologist available',
  radiologist: 'Radiologist available',
  intensivist: 'ICU intensivist available',
  burnSpecialist: 'Burn specialist available',
  ophthalmologist: 'Ophthalmologist available',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  ventilator: 'Ventilator available',
  ctScan: 'CT Scan available',
  mri: 'MRI available',
  xray: 'X-Ray available',
  ecg: 'ECG available',
  defibrillator: 'Defibrillator available',
  dialysis: 'Dialysis available',
  oxygen: 'Oxygen supply available',
  bloodBank: 'Blood bank available',
  operationTheater: 'Operation theater available',
};

export function calculateSuitabilityScore(
  hospital: Hospital,
  emergencyType: EmergencyType,
  distance: number
): { score: number; reasons: string[] } {
  const requirements = EMERGENCY_REQUIREMENTS[emergencyType];
  const reasons: string[] = [];
  let score = 0;
  const maxScore = 100;

  // Emergency status check (25 points)
  if (hospital.emergencyStatus === 'active') {
    score += 25;
    reasons.push('Emergency department active');
  } else if (hospital.emergencyStatus === 'limited') {
    score += 10;
    reasons.push('Emergency department (limited capacity)');
  }

  // ICU check (20 points)
  if (requirements.needsICU) {
    if (hospital.icu.available > 0) {
      score += 20;
      reasons.push(`ICU available (${hospital.icu.available}/${hospital.icu.total} beds)`);
    } else if (hospital.icu.total > 0) {
      score += 5;
    }
  } else {
    score += 20;
  }

  // Specialists check (25 points)
  const specialistPoints = requirements.specialists.length > 0 ? 25 / requirements.specialists.length : 0;
  for (const specialist of requirements.specialists) {
    if (hospital.specialists[specialist]) {
      score += specialistPoints;
      reasons.push(SPECIALIST_LABELS[specialist] || specialist);
    }
  }

  // Equipment check (20 points)
  const equipmentPoints = requirements.equipment.length > 0 ? 20 / requirements.equipment.length : 0;
  for (const equip of requirements.equipment) {
    if (hospital.equipment[equip]) {
      score += equipmentPoints;
      reasons.push(EQUIPMENT_LABELS[equip] || equip);
    }
  }

  // Distance factor (10 points) — closer is better
  if (distance <= 2) score += 10;
  else if (distance <= 5) score += 8;
  else if (distance <= 10) score += 5;
  else if (distance <= 20) score += 2;

  reasons.push(`${distance.toFixed(1)} km away`);

  // 24x7 bonus
  if (hospital.is24x7) {
    score += 5;
    reasons.push('24×7 emergency services');
  }

  // Ambulance bonus
  if (requirements.needsAmbulance && hospital.ambulance) {
    score += 3;
    reasons.push('Ambulance available');
  }

  // General bed availability
  if (hospital.beds.available > 0) {
    reasons.push(`${hospital.beds.available} general beds available`);
  }

  return {
    score: Math.min(Math.round(score), maxScore),
    reasons: reasons.slice(0, 7), // top 7 reasons
  };
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function estimateTravelTime(distanceKm: number): number {
  // Assume average urban speed of 30 km/h
  return Math.round((distanceKm / 30) * 60);
}

export function getEmergencyRequirements(type: EmergencyType): EmergencyRequirements {
  return EMERGENCY_REQUIREMENTS[type];
}

export function getEmergencyDescription(type: EmergencyType): string {
  return EMERGENCY_REQUIREMENTS[type].description;
}
