import React from 'react';
import { Link } from 'react-router-dom';
import { StructuredGuidanceResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Stethoscope, Building2, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Home } from 'lucide-react';

interface GuidanceResultProps {
  result: StructuredGuidanceResult;
  onReset?: () => void;
}

export const GuidanceResult: React.FC<GuidanceResultProps> = ({ result, onReset }) => {
  const { t } = useLanguage();

  const isEmergency = result.careLevel === 'URGENT_HOSPITAL' || result.emergency;
  const isClinic = result.careLevel === 'CLINIC';
  const isHomeCare = result.careLevel === 'HOME_CARE';

  // Semantic color coding based on exact CAREPATH palette:
  // Home Care -> Success #2E9B68
  // Clinic -> Warning #E9A23B
  // Urgent Hospital / Emergency -> Emergency #9E2020
  const headerBgColor = isEmergency
    ? '#9E2020'
    : isClinic
    ? '#E9A23B'
    : isHomeCare
    ? '#2E9B68'
    : '#A83232';

  return (
    <div
      className="rounded-3xl border shadow-md overflow-hidden animate-fadeIn"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
    >
      {/* Header Accent Bar */}
      <div
        className="px-6 py-4 flex items-center justify-between text-white"
        style={{ backgroundColor: headerBgColor }}
      >
        <div className="flex items-center gap-2">
          {isEmergency ? (
            <AlertTriangle className="w-5 h-5 text-white" />
          ) : isClinic ? (
            <Stethoscope className="w-5 h-5 text-white" />
          ) : isHomeCare ? (
            <Home className="w-5 h-5 text-white" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-white" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider">
            {t.yourNextStep}
          </span>
        </div>
        <span className="text-[11px] font-semibold bg-black/25 px-2.5 py-0.5 rounded-full">
          Level: {result.careLevel}
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Recommendation Title */}
        <div>
          <h3
            className="text-xl sm:text-2xl font-bold font-['Outfit']"
            style={{ color: '#252525' }}
          >
            {isEmergency
              ? t.urgentHospitalAdvice
              : isClinic
              ? t.clinicVisitAdvice
              : t.homeCareAdvice}
          </h3>
          {result.recommendedSpecialty && (
            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="text-slate-500">Suggested Specialty:</span>
              <span
                className="font-bold px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: '#FFF1F1',
                  color: '#D94A4A',
                  borderColor: '#F4B6B6',
                }}
              >
                {result.recommendedSpecialty}
              </span>
              {result.location && (
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" style={{ color: '#D94A4A' }} />
                  {result.location}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Structured Why Section */}
        <div
          className="rounded-2xl p-4 sm:p-5 border"
          style={{ backgroundColor: '#FFF1F1', borderColor: '#F4B6B6' }}
        >
          <span
            className="text-xs font-bold uppercase tracking-wider block mb-1"
            style={{ color: '#A83232' }}
          >
            {t.whyExplanation}
          </span>
          <p className="text-sm leading-relaxed" style={{ color: '#252525' }}>
            {result.reason}
          </p>

          {/* Captured Reported Symptoms */}
          {result.symptoms && result.symptoms.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#F4B6B6]">
              <span className="text-xs font-medium text-slate-500 block mb-1.5">
                Reported Observations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.symptoms.map((symptom, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2.5 py-1 rounded-md border"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#252525',
                      borderColor: '#F4B6B6',
                    }}
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Connect Buttons */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
            {t.whatYouCanDoNext}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to={`/appointments?specialty=${encodeURIComponent(result.recommendedSpecialty || 'General Medicine')}`}
              className="flex items-center justify-between p-4 rounded-xl text-white font-bold text-sm transition-all shadow-md group hover:bg-[#A83232]"
              style={{ backgroundColor: '#D94A4A' }}
            >
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-5 h-5 text-white" />
                <span>Book Doctor Appointment</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={`/hospitals?city=${encodeURIComponent(result.location || 'Nagpur')}`}
              className="flex items-center justify-between p-4 rounded-xl font-bold text-sm border transition-all group hover:bg-[#FFF1F1]"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#252525',
                borderColor: '#F4B6B6',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5" style={{ color: '#D94A4A' }} />
                <span>{t.findNearbyHospitals}</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Clean Non-Medical Boundary Stamp */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" style={{ color: '#2E9B68' }} />
            <span>Structured Guidance Output · Non-clinical advice</span>
          </div>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="font-semibold text-xs hover:underline"
              style={{ color: '#D94A4A' }}
            >
              Ask another concern
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
