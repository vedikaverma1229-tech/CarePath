import React from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Star, MapPin, Calendar, CheckCircle2, Clock } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  isBestMatch?: boolean;
  onBookAppointment?: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  isBestMatch = false,
}) => {
  const { t } = useLanguage();

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
        isBestMatch ? 'ring-2 ring-[#F4B6B6]' : ''
      }`}
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#F4B6B6',
      }}
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top Kicker: Best Match banner if applicable */}
        {isBestMatch && (
          <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b" style={{ borderColor: '#F4B6B6' }}>
            <span className="flex items-center gap-1.5" style={{ color: '#D94A4A' }}>
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#2E9B68' }} />
              {t.bestMatch}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              Matched for your care needs
            </span>
          </div>
        )}

        {/* Doctor Header */}
        <div className="flex items-start gap-4">
          {/* Avatar Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-white shrink-0 shadow-xs"
            style={{ backgroundColor: '#D94A4A' }}
          >
            {doctor.name
              .split(' ')
              .map((n) => n[0])
              .filter((_, i) => i < 2)
              .join('')}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4
                className="font-['Outfit'] font-bold text-base sm:text-lg truncate"
                style={{ color: '#252525' }}
              >
                {doctor.name}
              </h4>
              <div
                className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border shrink-0"
                style={{
                  backgroundColor: '#FFF9F9',
                  borderColor: '#F4B6B6',
                  color: '#252525',
                }}
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="tabular-nums">{doctor.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({doctor.reviews})</span>
              </div>
            </div>

            <p
              className="text-xs font-semibold mt-0.5 truncate"
              style={{ color: '#D94A4A' }}
            >
              {doctor.specialty}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
              <span>{doctor.qualification}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{doctor.experience} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Location & Hospital */}
        <div className="space-y-1.5 text-xs pt-2 border-t" style={{ borderColor: '#F4B6B6' }}>
          <div className="flex items-center gap-1.5 font-medium" style={{ color: '#252525' }}>
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#D94A4A' }} />
            <span className="truncate">{doctor.hospitalName}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 pl-5">
            <span>{doctor.location}</span>
            <span aria-hidden="true">·</span>
            <span
              className="tabular-nums font-semibold"
              style={{ color: '#2E9B68' }}
            >
              {doctor.distance}
            </span>
          </div>
        </div>

        {/* Availability & Languages */}
        <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: '#F4B6B6' }}>
          <span
            className="flex items-center gap-1.5 font-bold"
            style={{ color: '#2E9B68' }}
          >
            <Clock className="w-3.5 h-3.5" />
            {doctor.availability}
          </span>
          <span className="text-slate-500 text-[11px]">
            {doctor.languages.join(' · ')}
          </span>
        </div>
      </div>

      {/* Card Footer: Fee and Actions */}
      <div
        className="px-5 sm:px-6 py-4 border-t flex items-center justify-between gap-3"
        style={{
          backgroundColor: '#FFF9F9',
          borderColor: '#F4B6B6',
        }}
      >
        <div>
          <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
            Consultation Fee
          </span>
          <span
            className="font-['Outfit'] font-bold text-lg tabular-nums"
            style={{ color: '#252525' }}
          >
            ₹{doctor.fee}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/doctors/${doctor.id}`}
            className="px-3 py-2 text-xs font-semibold rounded-lg hover:bg-[#FFF1F1] transition-colors"
            style={{ color: '#252525' }}
          >
            {t.viewProfile}
          </Link>
          <Link
            to={`/appointments?doctorId=${doctor.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all active:scale-98 whitespace-nowrap hover:bg-[#A83232]"
            style={{ backgroundColor: '#D94A4A' }}
          >
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span>{t.bookAppointment}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
