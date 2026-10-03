import hospitalsData from '../data/hospitals.json';

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
  icuBeds: number;
  oxygenAvailable: boolean;
  departments: string[];
  facilities: string[];
  demoBadge: string;
}

export interface HospitalFilterCriteria {
  city?: string;
  emergencyOnly?: boolean;
  department?: string;
  query?: string;
}

export class HospitalService {
  private hospitals: Hospital[] = hospitalsData as Hospital[];

  getAllHospitals(): Hospital[] {
    return this.hospitals;
  }

  getHospitalById(id: string): Hospital | undefined {
    return this.hospitals.find((h) => h.id === id);
  }

  searchHospitals(criteria: HospitalFilterCriteria): { results: Hospital[]; total: number } {
    let filtered = [...this.hospitals];

    if (criteria.city && criteria.city.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        (h) => h.city.toLowerCase() === criteria.city!.toLowerCase()
      );
    }

    if (criteria.emergencyOnly) {
      filtered = filtered.filter((h) => h.emergency === true);
    }

    if (criteria.department && criteria.department.toLowerCase() !== 'all') {
      filtered = filtered.filter((h) =>
        h.departments.some((d) =>
          d.toLowerCase().includes(criteria.department!.toLowerCase())
        )
      );
    }

    if (criteria.query && criteria.query.trim().length > 0) {
      const q = criteria.query.toLowerCase().trim();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.departments.some((d) => d.toLowerCase().includes(q))
      );
    }

    return { results: filtered, total: filtered.length };
  }
}

export const hospitalService = new HospitalService();
