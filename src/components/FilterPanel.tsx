import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, MapPin, SlidersHorizontal, LocateFixed, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedSpecialty: string;
  onSpecialtyChange: (specialty: string) => void;
  maxBudget: number;
  onBudgetChange: (budget: number) => void;
  selectedAvailability: string;
  onAvailabilityChange: (avail: string) => void;
  onReset: () => void;
}

const CITIES = ['All', 'Nagpur', 'Bhopal', 'Indore'];
const SPECIALTIES = [
  'All',
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology & Obstetrics',
  'Ophthalmology',
  'Psychiatry',
  'Gastroenterology',
  'Nephrology',
  'Urology',
  'Oncology',
  'General Medicine',
  'ENT',
];
const AVAILABILITIES = ['All', 'Available Today', 'Available Tomorrow'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedSpecialty,
  onSpecialtyChange,
  maxBudget,
  onBudgetChange,
  selectedAvailability,
  onAvailabilityChange,
  onReset,
}) => {
  const { t } = useLanguage();

  const handleUseCurrentLocation = () => {
    onCityChange('Nagpur');
  };

  return (
    <div
      className="rounded-3xl border p-5 sm:p-6 shadow-xs space-y-5"
      style={{
        backgroundColor: '#FFFFFF', // Cards: White #FFFFFF
        borderColor: '#F4B6B6', // Border: #F4B6B6
      }}
    >
      {/* Top Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchDoctorPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 placeholder:text-slate-400"
          style={{
            backgroundColor: '#FFF9F9',
            borderColor: '#F4B6B6',
            color: '#252525',
          }}
        />
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Filter with Current Location quick pick */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold" style={{ color: '#252525' }}>
              {t.filterByCity}
            </label>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="text-[11px] font-bold flex items-center gap-1 hover:underline"
              style={{ color: '#D94A4A' }}
              title="Detect current location"
            >
              <LocateFixed className="w-3 h-3" />
              <span>Current</span>
            </button>
          </div>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:ring-2 font-medium"
            style={{ borderColor: '#F4B6B6', color: '#252525' }}
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Cities' : `${c} (Central India)`}
              </option>
            ))}
          </select>
        </div>

        {/* Specialty Filter */}
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: '#252525' }}>
            {t.filterBySpecialty}
          </label>
          <select
            value={selectedSpecialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:ring-2 font-medium"
            style={{ borderColor: '#F4B6B6', color: '#252525' }}
          >
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Specialties' : s}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Filter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold" style={{ color: '#252525' }}>
              {t.filterByBudget}
            </label>
            <span className="text-xs font-extrabold tabular-nums" style={{ color: '#D94A4A' }}>
              ₹{maxBudget}
            </span>
          </div>
          <input
            type="range"
            min={300}
            max={5000}
            step={100}
            value={maxBudget}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            className="w-full cursor-pointer accent-[#D94A4A]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
            <span>₹300</span>
            <span>₹2,500</span>
            <span>₹5,000</span>
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: '#252525' }}>
            {t.filterByAvailability}
          </label>
          <select
            value={selectedAvailability}
            onChange={(e) => onAvailabilityChange(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:ring-2 font-medium"
            style={{ borderColor: '#F4B6B6', color: '#252525' }}
          >
            {AVAILABILITIES.map((a) => (
              <option key={a} value={a}>
                {a === 'All' ? 'Any Availability' : a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Filter Action */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: '#D94A4A' }} />
          <span>Showing results sorted for Best Match preference</span>
        </span>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold flex items-center gap-1 transition-colors hover:underline"
          style={{ color: '#D94A4A' }}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};
