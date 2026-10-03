import doctorsData from '../data/doctors.json';

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

export interface DoctorFilterCriteria {
  city?: string;
  specialty?: string;
  maxFee?: number;
  availability?: string;
  query?: string;
}

export class DoctorService {
  private doctors: Doctor[] = doctorsData as Doctor[];

  getAllDoctors(): Doctor[] {
    return this.doctors;
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.doctors.find((doc) => doc.id === id);
  }

  searchAndMatch(criteria: DoctorFilterCriteria): { results: Doctor[]; total: number } {
    let filtered = [...this.doctors];

    if (criteria.city && criteria.city.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        (doc) => doc.city.toLowerCase() === criteria.city!.toLowerCase()
      );
    }

    if (criteria.specialty && criteria.specialty.toLowerCase() !== 'all') {
      filtered = filtered.filter((doc) =>
        doc.specialty.toLowerCase().includes(criteria.specialty!.toLowerCase())
      );
    }

    if (criteria.maxFee && criteria.maxFee > 0) {
      filtered = filtered.filter((doc) => doc.fee <= criteria.maxFee!);
    }

    if (criteria.availability && criteria.availability.toLowerCase() !== 'all') {
      filtered = filtered.filter((doc) =>
        doc.availability.toLowerCase().includes(criteria.availability!.toLowerCase())
      );
    }

    if (criteria.query && criteria.query.trim().length > 0) {
      const q = criteria.query.toLowerCase().trim();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.hospitalName.toLowerCase().includes(q) ||
          doc.location.toLowerCase().includes(q) ||
          doc.languages.some((l) => l.toLowerCase().includes(q))
      );
    }

    // Sort by rating and experience for "Best Match" prioritization
    filtered.sort((a, b) => b.rating - a.rating || b.experience - a.experience);

    return { results: filtered, total: filtered.length };
  }
}

export const doctorService = new DoctorService();
