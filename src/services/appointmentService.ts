import { Appointment, BedRequest } from '../types';

export interface BookingPayload {
  doctorId: string;
  doctorName?: string;
  patientName: string;
  patientPhone: string;
  date: string;
  timeSlot: string;
  notes?: string;
}

export interface BedRequestPayload {
  hospitalId: string;
  hospitalName?: string;
  patientName: string;
  contact: string;
  department: string;
  bedType: 'general' | 'icu' | 'oxygen';
}

export const bookAppointmentDemo = async (payload: BookingPayload): Promise<Appointment> => {
  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // Fallback
  }

  return {
    id: `apt-demo-${Date.now().toString(36)}`,
    ...payload,
    status: 'confirmed_demo',
    createdAt: new Date().toISOString(),
  };
};

export const requestBedAssistanceDemo = async (payload: BedRequestPayload): Promise<BedRequest> => {
  try {
    const res = await fetch('/api/bed-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // Fallback
  }

  return {
    id: `bed-demo-${Date.now().toString(36)}`,
    ...payload,
    status: 'submitted_demo',
    createdAt: new Date().toISOString(),
  };
};
