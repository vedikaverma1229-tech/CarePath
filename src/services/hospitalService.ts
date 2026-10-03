import { Hospital } from '../types';
import localHospitals from '../../backend/data/hospitals.json';

export interface HospitalSearchParams {
  city?: string;
  emergencyOnly?: boolean;
  department?: string;
  query?: string;
}

export const fetchHospitals = async (params?: HospitalSearchParams): Promise<Hospital[]> => {
  try {
    const queryParts: string[] = [];
    if (params?.city && params.city !== 'All') queryParts.push(`city=${encodeURIComponent(params.city)}`);
    if (params?.emergencyOnly) queryParts.push(`emergencyOnly=true`);
    if (params?.department && params.department !== 'All') queryParts.push(`department=${encodeURIComponent(params.department)}`);
    if (params?.query) queryParts.push(`query=${encodeURIComponent(params.query)}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const res = await fetch(`/api/search/hospitals${queryString}`);
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch {
    // Client fallback
  }

  let list = [...(localHospitals as Hospital[])];
  if (params?.city && params.city !== 'All') {
    list = list.filter((h) => h.city.toLowerCase() === params.city!.toLowerCase());
  }
  if (params?.emergencyOnly) {
    list = list.filter((h) => h.emergency === true);
  }
  if (params?.department && params.department !== 'All') {
    list = list.filter((h) =>
      h.departments.some((d) => d.toLowerCase().includes(params.department!.toLowerCase()))
    );
  }
  if (params?.query) {
    const q = params.query.toLowerCase().trim();
    list = list.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.departments.some((d) => d.toLowerCase().includes(q))
    );
  }
  return list;
};

export const fetchHospitalById = async (id: string): Promise<Hospital | null> => {
  try {
    const res = await fetch(`/api/hospitals/${id}`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // Fallback
  }
  return (localHospitals as Hospital[]).find((h) => h.id === id) || null;
};

export const requestHospitalBed = async (payload: {
  hospitalId: string;
  hospitalName?: string;
  patientName: string;
  patientPhone: string;
  department: string;
  bedType: 'general' | 'icu' | 'oxygen';
  notes?: string;
}) => {
  try {
    const res = await fetch('/api/bed-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        contact: payload.patientPhone,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // Fallback
  }
  return {
    id: `bed-req-${Date.now().toString(36)}`,
    hospitalId: payload.hospitalId,
    hospitalName: payload.hospitalName || 'Regional Hospital',
    patientName: payload.patientName,
    contact: payload.patientPhone,
    department: payload.department,
    bedType: payload.bedType,
    status: 'received',
    createdAt: new Date().toISOString(),
  };
};
