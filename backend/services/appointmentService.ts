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

export class AppointmentService {
  private appointments: Appointment[] = [];
  private bedRequests: BedRequest[] = [];

  createAppointment(data: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Appointment {
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      status: 'confirmed_demo',
      createdAt: new Date().toISOString(),
    };
    this.appointments.unshift(newAppointment);
    return newAppointment;
  }

  createBedRequest(data: Omit<BedRequest, 'id' | 'status' | 'createdAt'>): BedRequest {
    const newBedRequest: BedRequest = {
      ...data,
      id: `bed-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      status: 'submitted_demo',
      createdAt: new Date().toISOString(),
    };
    this.bedRequests.unshift(newBedRequest);
    return newBedRequest;
  }

  getAppointments(): Appointment[] {
    return this.appointments;
  }

  getBedRequests(): BedRequest[] {
    return this.bedRequests;
  }
}

export const appointmentService = new AppointmentService();
