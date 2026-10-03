import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, PhoneCall, Building2, Navigation, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EmergencyCardProps {
  onDismiss?: () => void;
  reason?: string;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({ reason }) => {
  const { t } = useLanguage();

  return (
    <div
      role="alert"
      className="text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 space-y-6 animate-fadeIn"
      style={{
        backgroundColor: '#9E2020',
        borderColor: '#A83232',
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <AlertOctagon className="w-7 h-7 text-white animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#FFFFFF', color: '#9E2020' }}
            >
              High Priority Warning
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] tracking-tight">
            {t.emergencyBannerTitle}
          </h2>
          <p className="text-sm sm:text-base text-red-100 font-medium leading-relaxed">
            {t.emergencyBannerDesc}
          </p>
          {reason && (
            <p className="text-xs text-red-200 mt-2 bg-black/25 p-2.5 rounded-xl border border-white/20">
              <strong className="text-white">Reason noted:</strong> {reason}
            </p>
          )}
        </div>
      </div>

      {/* Critical Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {/* Call 112 */}
        <a
          href="tel:112"
          className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-extrabold text-sm shadow-md transition-all active:scale-98 text-center hover:opacity-95"
          style={{ backgroundColor: '#FFFFFF', color: '#9E2020' }}
        >
          <PhoneCall className="w-4 h-4" style={{ color: '#9E2020' }} />
          <span>CALL 112</span>
        </a>

        {/* Call 108 Ambulance */}
        <a
          href="tel:108"
          className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white font-extrabold text-sm border shadow-md transition-all active:scale-98 text-center hover:bg-[#A83232]"
          style={{ backgroundColor: '#A83232', borderColor: '#F4B6B6' }}
        >
          <PhoneCall className="w-4 h-4 text-white" />
          <span>CALL 108 (Ambulance)</span>
        </a>

        {/* Find Nearest Hospital */}
        <Link
          to="/hospitals?emergencyOnly=true"
          className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white font-bold text-sm border transition-all text-center hover:bg-[#A83232]"
          style={{ backgroundColor: '#A83232', borderColor: '#F4B6B6' }}
        >
          <Building2 className="w-4 h-4 text-white" />
          <span>FIND NEAREST HOSPITAL</span>
        </Link>

        {/* Get Directions */}
        <a
          href="https://www.google.com/maps/search/emergency+hospital+near+me"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white font-bold text-sm border transition-all text-center hover:bg-[#A83232]"
          style={{ backgroundColor: '#A83232', borderColor: '#F4B6B6' }}
        >
          <Navigation className="w-4 h-4 text-white" />
          <span>GET DIRECTIONS</span>
        </a>
      </div>

      {/* Explicit disclaimer that ambulance is not dispatched automatically */}
      <div className="flex items-center justify-between text-xs text-red-200 pt-1 border-t border-red-500/50">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
          <span>CarePath provides immediate navigation guidance. Please dial 112 directly from your phone.</span>
        </div>
      </div>
    </div>
  );
};
