import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchHospitals } from '../services/hospitalService';
import { Hospital } from '../types';
import {
  PhoneCall,
  AlertOctagon,
  Building2,
  Navigation,
  ShieldAlert,
  HeartPulse,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const Emergency: React.FC = () => {
  const { t } = useLanguage();
  const [emergencyHospitals, setEmergencyHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    fetchHospitals({ emergencyOnly: true }).then((list) => {
      setEmergencyHospitals(list);
    });
  }, []);

  return (
    <div
      className="min-h-screen py-8 sm:py-12"
      style={{ backgroundColor: '#FFF9F9' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Primary Emergency Banner Block with #9E2020 and #A83232 */}
        <div
          className="text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 space-y-6"
          style={{
            backgroundColor: '#9E2020', // Exact Deep Emergency Red
            borderColor: '#A83232',
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-8 h-8 text-white animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <span
                className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block"
                style={{ backgroundColor: '#FFFFFF', color: '#9E2020' }}
              >
                Immediate Clinical Escalation
              </span>
              <h1 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl tracking-tight">
                {t.emergencyBannerTitle}
              </h1>
              <p className="text-sm sm:text-base text-red-100 font-medium leading-relaxed max-w-2xl">
                {t.emergencyBannerDesc}
              </p>
            </div>
          </div>

          {/* Big Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {/* Call 112 */}
            <a
              href="tel:112"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl font-extrabold text-base shadow-lg transition-transform active:scale-98"
              style={{ backgroundColor: '#FFFFFF', color: '#9E2020' }}
            >
              <PhoneCall className="w-5 h-5 animate-bounce" style={{ color: '#D94A4A' }} />
              <span>DIAL 112 (National)</span>
            </a>

            {/* Call 108 */}
            <a
              href="tel:108"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl text-white font-extrabold text-base border shadow-lg transition-transform active:scale-98"
              style={{ backgroundColor: '#A83232', borderColor: '#F4B6B6' }}
            >
              <PhoneCall className="w-5 h-5 text-white" />
              <span>DIAL 108 (Ambulance)</span>
            </a>

            {/* Direct Map Route */}
            <a
              href="https://www.google.com/maps/search/emergency+hospital+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 rounded-2xl text-white font-bold text-sm border transition-all text-center"
              style={{ backgroundColor: '#A83232', borderColor: '#F4B6B6' }}
            >
              <Navigation className="w-5 h-5 text-white" />
              <span>Nearest Emergency on Map</span>
            </a>
          </div>

          {/* Clear non-dispatch rule */}
          <div className="pt-2 border-t border-red-500/50 flex items-center gap-2 text-xs text-red-200">
            <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              CarePath provides immediate navigation assistance. Please dial 112 or 108 directly from your handset. No automated vehicle dispatch is claimed.
            </span>
          </div>
        </div>

        {/* 24x7 Emergency Hospitals List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="font-['Outfit'] font-bold text-xl sm:text-2xl"
                style={{ color: '#252525' }}
              >
                Verified 24x7 Emergency Trauma Centers
              </h2>
              <p className="text-xs text-slate-500">
                Direct emergency departments with on-call casualty physicians and ambulance coordination.
              </p>
            </div>
            <Link
              to="/hospitals"
              className="text-xs font-bold hover:underline"
              style={{ color: '#D94A4A' }}
            >
              View all {emergencyHospitals.length} centers →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="rounded-2xl border p-5 shadow-xs transition-all space-y-3"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: '#FFF1F1',
                        color: '#9E2020',
                        borderColor: '#F4B6B6',
                      }}
                    >
                      24x7 Casualty Unit
                    </span>
                    <h3
                      className="font-['Outfit'] font-bold text-lg mt-1"
                      style={{ color: '#252525' }}
                    >
                      {hosp.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {hosp.location}, {hosp.city} · <strong style={{ color: '#2E9B68' }}>{hosp.distance}</strong>
                    </p>
                  </div>

                  <div className="text-right text-xs">
                    <span
                      className="font-bold block tabular-nums text-sm"
                      style={{ color: '#252525' }}
                    >
                      {hosp.icuBeds} ICU Beds
                    </span>
                    <span className="text-[10px] text-slate-400">Demo Availability</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs gap-2">
                  <a
                    href={`tel:${hosp.emergencyContact}`}
                    className="font-bold hover:underline flex items-center gap-1"
                    style={{ color: '#9E2020' }}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call {hosp.emergencyContact}</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${hosp.name} ${hosp.location}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border font-medium bg-white hover:bg-slate-50"
                    style={{ color: '#252525', borderColor: '#F4B6B6' }}
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical First-Aid Advice for Common Emergencies */}
        <div
          className="rounded-3xl p-6 sm:p-8 space-y-4 border"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
        >
          <h3
            className="font-['Outfit'] font-bold text-lg"
            style={{ color: '#252525' }}
          >
            Critical First Steps While Help Arrives
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div
              className="p-4 rounded-xl border space-y-1"
              style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
            >
              <strong className="block font-bold" style={{ color: '#9E2020' }}>
                1. Suspected Heart Attack / Chest Pain
              </strong>
              <p className="text-slate-600">
                Keep the patient seated upright, loosen tight clothing, encourage calm, slow breathing. Do not allow exertion.
              </p>
            </div>

            <div
              className="p-4 rounded-xl border space-y-1"
              style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
            >
              <strong className="block font-bold" style={{ color: '#9E2020' }}>
                2. Severe Difficulty Breathing
              </strong>
              <p className="text-slate-600">
                Ensure fresh ventilation, sit patient leaning slightly forward. If prescribed inhaler is present, assist with it.
              </p>
            </div>

            <div
              className="p-4 rounded-xl border space-y-1"
              style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
            >
              <strong className="block font-bold" style={{ color: '#9E2020' }}>
                3. Trauma / Uncontrolled Bleeding
              </strong>
              <p className="text-slate-600">
                Apply firm, direct pressure with a clean cloth over the wound. Elevate the injured area if no bone fracture is suspected.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
