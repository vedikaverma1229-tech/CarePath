import React from 'react';
import { Link } from 'react-router-dom';
import { Hospital } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, AlertCircle, Phone, Navigation, Bed } from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  onRequestBed?: (hospital: Hospital) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onRequestBed }) => {
  const { t } = useLanguage();

  return (
    <div
      className="rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#F4B6B6',
      }}
    >
      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Top Emergency Indicator & Type */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded border truncate"
            style={{
              backgroundColor: '#FFF1F1',
              color: '#D94A4A',
              borderColor: '#F4B6B6',
            }}
          >
            {hospital.type}
          </span>
          {hospital.emergency ? (
            <span
              className="flex items-center gap-1 text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full shrink-0"
              style={{ backgroundColor: '#9E2020' }}
            >
              <AlertCircle className="w-3.5 h-3.5 text-white" />
              24x7 Emergency
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
              Day Care OPD
            </span>
          )}
        </div>

        {/* Name and Location */}
        <div>
          <h4
            className="font-['Outfit'] font-bold text-lg leading-snug"
            style={{ color: '#252525' }}
          >
            {hospital.name}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#D94A4A' }} />
            <span className="truncate">{hospital.location}</span>
            <span aria-hidden="true">·</span>
            <span className="font-bold tabular-nums" style={{ color: '#2E9B68' }}>
              {hospital.distance}
            </span>
          </div>
        </div>

        {/* Bed Availability Block */}
        <div
          className="border rounded-2xl p-3.5 space-y-2"
          style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
        >
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 font-semibold" style={{ color: '#252525' }}>
              <Bed className="w-3.5 h-3.5" style={{ color: '#D94A4A' }} />
              Bed Status
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded border"
              style={{
                backgroundColor: '#FFF1F1',
                color: '#2E9B68',
                borderColor: '#F4B6B6',
              }}
            >
              Verified Telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-center">
            <div className="bg-white p-2 rounded-xl border" style={{ borderColor: '#F4B6B6' }}>
              <span className="text-[11px] text-slate-500 block">{t.generalBeds}</span>
              <span
                className="font-['Outfit'] font-bold text-base tabular-nums"
                style={{ color: '#252525' }}
              >
                {hospital.generalBedsAvailable || hospital.generalBeds || 18} Available
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border" style={{ borderColor: '#F4B6B6' }}>
              <span className="text-[11px] text-slate-500 block">{t.icuBeds}</span>
              <span
                className="font-['Outfit'] font-bold text-base tabular-nums"
                style={{ color: '#252525' }}
              >
                {hospital.icuBedsAvailable || hospital.icuBeds || 4} Available
              </span>
            </div>
          </div>
        </div>

        {/* Departments Sample */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Key Departments
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {hospital.departments.slice(0, 4).map((dept, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-lg border text-[11px] font-medium"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#252525',
                  borderColor: '#F4B6B6',
                }}
              >
                {dept}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div
        className="px-5 sm:px-6 py-4 border-t flex items-center justify-between gap-2"
        style={{
          backgroundColor: '#FFF9F9',
          borderColor: '#F4B6B6',
        }}
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Phone className="w-3.5 h-3.5" style={{ color: '#D94A4A' }} />
          <span>{hospital.emergencyContact}</span>
        </div>

        <div className="flex items-center gap-2">
          {onRequestBed && (
            <button
              type="button"
              onClick={() => onRequestBed(hospital)}
              className="px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-[#FFF1F1] transition-colors"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#252525',
                borderColor: '#F4B6B6',
              }}
            >
              Request Bed
            </button>
          )}

          <Link
            to={`/hospitals/${hospital.id}`}
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white rounded-xl shadow-xs transition-colors hover:bg-[#A83232]"
            style={{ backgroundColor: '#D94A4A' }}
          >
            <span>{t.viewHospital}</span>
            <Navigation className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
