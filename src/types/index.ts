export type Language = 'en' | 'hi' | 'mr';

export type CareLevel = 'HOME_CARE' | 'CLINIC' | 'URGENT_HOSPITAL';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  fee: number;
  rating: number;
  reviews: number;
  hospitalId: string;
  hospitalName: string;
  city: string;
  location: string;
  distance: string;
  availability: string;
  availableSlots: string[];
  languages: string[];
  about: string;
  gender: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: string;
  city: string;
  location: string;
  distance: string;
  emergency: boolean;
  emergencyContact: string;
  ambulanceContact: string;
  generalBeds: number;
  generalBedsAvailable?: number;
  icuBeds: number;
  icuBedsAvailable?: number;
  oxygenAvailable: boolean;
  departments: string[];
  facilities: string[];
  demoBadge: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName?: string;
  patientName: string;
  patientPhone: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'confirmed_demo' | 'pending';
  createdAt: string;
}

export interface BedRequest {
  id: string;
  hospitalId: string;
  hospitalName?: string;
  patientName: string;
  contact: string;
  department: string;
  bedType: 'general' | 'icu' | 'oxygen';
  status: 'submitted_demo';
  createdAt: string;
}

export interface StructuredGuidanceResult {
  conversationId: string;
  status: string;
  careLevel: CareLevel;
  reason: string;
  emergency: boolean;
  symptoms: string[];
  recommendedSpecialty: string;
  recommendedDoctorType?: string;
  location: string;
  budget: number;
  language: string;
}

export interface ChatMessageItem {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  isEmergencyAlert?: boolean;
  guidanceResult?: StructuredGuidanceResult;
  modelUsed?: string;
  groundingSources?: Array<{ title: string; uri: string }>;
  searchQueries?: string[];
}

export type ConversationState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'AI_ASKING'
  | 'USER_ANSWERING'
  | 'GUIDANCE_READY'
  | 'EMERGENCY'
  | 'ERROR';
