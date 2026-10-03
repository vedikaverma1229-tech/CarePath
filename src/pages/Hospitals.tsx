import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchHospitals } from '../services/hospitalService';
import { Hospital } from '../types';
import { HospitalCard } from '../components/HospitalCard';
import { BedRequestModal } from '../components/BedRequestModal';
import {
  Building2,
  Search,
  AlertCircle,
  Bed,
  MapPin,
  ShieldCheck,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';

const CITIES = ['All', 'Nagpur', 'Bhopal', 'Indore'];

export const Hospitals: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'Nagpur');
  const [emergencyOnly, setEmergencyOnly] = useState(
    searchParams.get('emergencyOnly') === 'true'
  );

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestBedHospital, setRequestBedHospital] = useState<Hospital | null>(null);

  const loadHospitals = async () => {
    setIsLoading(true);
    try {
      const results = await fetchHospitals({
        city: selectedCity,
        emergencyOnly,
        query: searchQuery,
      });
      setHospitals(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, [selectedCity, emergencyOnly, searchQuery]);

  return (
    <div
      className="min-h-screen py-8 sm:py-10"
      style={{ backgroundColor: '#FFF9F9' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: '#D94A4A' }}
            >
              Regional Infrastructure
            </span>
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: '#FFF1F1',
                color: '#252525',
                borderColor: '#F4B6B6',
              }}
            >
              {hospitals.length} Healthcare Facilities
            </span>
          </div>
          <h1
            className="font-['Outfit'] font-bold text-2xl sm:text-3xl"
            style={{ color: '#252525' }}
          >
            Hospitals & Bed Assistance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Locate multi-specialty hospitals, community health centers, and emergency trauma facilities with verified bed availability tracking.
          </p>
        </div>

        {/* Filter Row */}
        <div
          className="rounded-3xl border p-5 shadow-xs space-y-4"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#F4B6B6',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            {/* Search bar */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital name, location, or department..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#FFF9F9',
                  borderColor: '#F4B6B6',
                  color: '#252525',
                }}
              />
            </div>

            {/* City Selector */}
            <div className="sm:col-span-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:ring-2 font-medium"
                style={{ borderColor: '#F4B6B6', color: '#252525' }}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Cities' : `${c} Region`}
                  </option>
                ))}
              </select>
            </div>

            {/* 24x7 Emergency Toggle */}
            <div className="sm:col-span-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setEmergencyOnly(!emergencyOnly)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs"
                style={{
                  backgroundColor: emergencyOnly ? '#9E2020' : '#FFF1F1',
                  color: emergencyOnly ? '#FFFFFF' : '#9E2020',
                  borderColor: emergencyOnly ? '#A83232' : '#F4B6B6',
                }}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>24x7 Emergency Only</span>
              </button>
            </div>

          </div>
        </div>

        {/* Hospital Cards Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#D94A4A' }} />
            <p className="text-xs font-semibold text-slate-500">Checking hospital directory...</p>
          </div>
        ) : hospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitals.map((hospital) => (
              <HospitalCard
                key={hospital.id}
                hospital={hospital}
                onRequestBed={(hosp) => setRequestBedHospital(hosp)}
              />
            ))}
          </div>
        ) : (
          <div
            className="rounded-3xl border p-12 text-center space-y-3"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
          >
            <Building2 className="w-10 h-10 mx-auto" style={{ color: '#D94A4A' }} />
            <h3
              className="font-['Outfit'] font-bold text-lg"
              style={{ color: '#252525' }}
            >
              No hospitals match your search
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try selecting a different city or clearing the 24x7 emergency filter.
            </p>
          </div>
        )}

        {/* Verification Telemetry Notice Banner */}
        <div
          className="border rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs"
          style={{
            backgroundColor: '#FFF9F9',
            borderColor: '#F4B6B6',
            color: '#252525',
          }}
        >
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#2E9B68' }} />
          <div className="space-y-0.5">
            <span className="font-bold" style={{ color: '#D94A4A' }}>Verified Hospital Telemetry & Bed Status</span>
            <p className="text-slate-600 leading-relaxed">
              Operational bed telemetry is monitored across regional health networks to assist patients in selecting the appropriate facility before travel.
            </p>
          </div>
        </div>

        {/* Bed Assistance Modal */}
        {requestBedHospital && (
          <BedRequestModal
            hospital={requestBedHospital}
            isOpen={!!requestBedHospital}
            onClose={() => setRequestBedHospital(null)}
          />
        )}

      </div>
    </div>
  );
};
