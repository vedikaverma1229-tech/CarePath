import { Doctor } from '../types';
import localDoctors from '../../backend/data/doctors.json';

export interface DoctorSearchParams {
  city?: string;
  specialty?: string;
  maxFee?: number;
  availability?: string;
  query?: string;
}

export const fetchDoctors = async (params?: DoctorSearchParams): Promise<Doctor[]> => {
  try {
    const queryParts: string[] = [];
    if (params?.city && params.city !== 'All') queryParts.push(`city=${encodeURIComponent(params.city)}`);
    if (params?.specialty && params.specialty !== 'All') queryParts.push(`specialty=${encodeURIComponent(params.specialty)}`);
    if (params?.maxFee) queryParts.push(`maxFee=${params.maxFee}`);
    if (params?.availability && params.availability !== 'All') queryParts.push(`availability=${encodeURIComponent(params.availability)}`);
    if (params?.query) queryParts.push(`query=${encodeURIComponent(params.query)}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const res = await fetch(`/api/search/doctors${queryString}`);
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch {
    // Client-side fallback to bundled local JSON
  }

  // Client-side fallback filter
  let list = [...(localDoctors as Doctor[])];
  if (params?.city && params.city !== 'All') {
    list = list.filter((d) => d.city.toLowerCase() === params.city!.toLowerCase());
  }
  if (params?.specialty && params.specialty !== 'All') {
    list = list.filter((d) => d.specialty.toLowerCase().includes(params.specialty!.toLowerCase()));
  }
  if (params?.maxFee) {
    list = list.filter((d) => d.fee <= params.maxFee!);
  }
  if (params?.availability && params.availability !== 'All') {
    list = list.filter((d) => d.availability.toLowerCase().includes(params.availability!.toLowerCase()));
  }
  if (params?.query) {
    const q = params.query.toLowerCase().trim();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q)
    );
  }
  return list;
};

export const fetchDoctorById = async (id: string): Promise<Doctor | null> => {
  try {
    const res = await fetch(`/api/doctors/${id}`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // Fallback
  }
  return (localDoctors as Doctor[]).find((d) => d.id === id) || null;
};

export const bookAppointment = async (payload: {
  doctorId: string;
  doctorName?: string;
  patientName: string;
  patientPhone: string;
  date: string;
  timeSlot: string;
  notes?: string;
  fee?: number;
  userId?: string;
}) => {
  let createdApt: any = null;

  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      createdApt = json.data;
    }
  } catch {
    // Continue to Firestore persistence
  }

  if (!createdApt) {
    createdApt = {
      id: `apt-${Date.now().toString(36)}`,
      ...payload,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
  }

  // Persist to Firebase Firestore
  try {
    const { db, collection, addDoc, auth } = await import('../lib/firebase');
    const uid = payload.userId || auth.currentUser?.uid || null;
    await addDoc(collection(db, 'appointments'), {
      ...createdApt,
      userId: uid,
      syncedAt: new Date().toISOString(),
    });
  } catch (firestoreErr) {
    console.warn('Firestore appointment sync warning:', firestoreErr);
  }

  return createdApt;
};
