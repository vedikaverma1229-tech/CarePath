import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchDoctors } from '../services/doctorService';
import { Doctor } from '../types';
import { DoctorCard } from '../components/DoctorCard';
import { FilterPanel } from '../components/FilterPanel';
import { AppointmentModal } from '../components/AppointmentModal';
import { Stethoscope, CheckCircle2, ShieldCheck, Loader2, Calendar } from 'lucide-react';

export const Doctors: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'Nagpur');
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    searchParams.get('specialty') || 'All'
  );
  const [maxBudget, setMaxBudget] = useState(5000);
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const results = await fetchDoctors({
        city: selectedCity,
        specialty: selectedSpecialty,
        maxFee: maxBudget,
        availability: selectedAvailability,
        query: searchQuery,
      });
      setDoctors(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [selectedCity, selectedSpecialty, maxBudget, selectedAvailability, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('Nagpur');
    setSelectedSpecialty('All');
    setMaxBudget(5000);
    setSelectedAvailability('All');
  };

  return (
    <div
      className="min-h-screen py-8 sm:py-10"
      style={{ backgroundColor: '#FFF9F9' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: '#D94A4A' }}
              >
                Healthcare Discovery
              </span>
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: '#FFF1F1',
                  color: '#252525',
                  borderColor: '#F4B6B6',
                }}
              >
                {doctors.length} Verified Providers Found
              </span>
            </div>
            <h1
              className="font-['Outfit'] font-bold text-2xl sm:text-3xl"
              style={{ color: '#252525' }}
            >
              Find the Right Healthcare Option
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Filter doctors and specialized clinics based on your preferred location, medical specialty, consultation budget, and immediate availability.
            </p>
          </div>

          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xs transition-transform active:scale-98 self-start sm:self-auto"
            style={{ backgroundColor: '#D94A4A' }}
          >
            <Calendar className="w-4 h-4" />
            <span>Open Appointment Booking Page</span>
          </Link>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          selectedSpecialty={selectedSpecialty}
          onSpecialtyChange={setSelectedSpecialty}
          maxBudget={maxBudget}
          onBudgetChange={setMaxBudget}
          selectedAvailability={selectedAvailability}
          onAvailabilityChange={setSelectedAvailability}
          onReset={handleResetFilters}
        />

        {/* Doctor Cards Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#D94A4A' }} />
            <p className="text-xs font-semibold text-slate-500">Matching verified doctors...</p>
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                isBestMatch={index === 0}
                onBookAppointment={(doc) => setBookingDoctor(doc)}
              />
            ))}
          </div>
        ) : (
          <div
            className="rounded-3xl border p-12 text-center space-y-3"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
          >
            <Stethoscope className="w-10 h-10 mx-auto" style={{ color: '#D94A4A' }} />
            <h3
              className="font-['Outfit'] font-bold text-lg"
              style={{ color: '#252525' }}
            >
              No doctors matched your current filters
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your budget limit or broadening your specialty selection to see more healthcare professionals.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold rounded-xl border"
              style={{
                backgroundColor: '#FFF1F1',
                color: '#D94A4A',
                borderColor: '#F4B6B6',
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Matching Algorithm Transparency & Safety Disclaimer */}
        <div
          className="rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#F4B6B6',
            color: '#252525',
          }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#2E9B68' }} />
            <span>
              <strong>Best Match System:</strong> Providers are sorted strictly by user-selected preferences (city, specialty, budget, distance, ratings). Not a clinical diagnosis endorsement.
            </span>
          </div>
          <span className="text-[11px] text-slate-500 italic shrink-0">
            {t.prototypeDisclaimer}
          </span>
        </div>

        {/* Appointment Modal */}
        {bookingDoctor && (
          <AppointmentModal
            doctor={bookingDoctor}
            isOpen={!!bookingDoctor}
            onClose={() => setBookingDoctor(null)}
          />
        )}

      </div>
    </div>
  );
};
