import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchHospitalById } from '../services/hospitalService';
import { Hospital } from '../types';
import { BedRequestModal } from '../components/BedRequestModal';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Navigation,
  Bed,
  HeartPulse,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const HospitalProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBedModalOpen, setIsBedModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHospitalById(id).then((h) => {
        setHospital(h);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-500">
        Loading hospital profile...
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold" style={{ color: '#252525' }}>Hospital Not Found</h2>
        <Link
          to="/hospitals"
          className="text-sm font-semibold hover:underline"
          style={{ color: '#D94A4A' }}
        >
          ← Back to Hospital Directory
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 sm:py-10"
      style={{ backgroundColor: '#FFF9F9' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back button */}
        <Link
          to="/hospitals"
          className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline"
          style={{ color: '#252525' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospitals Directory</span>
        </Link>

        {/* Main Profile Card */}
        <div
          className="rounded-3xl border shadow-sm overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
        >
          
          {/* Header Hero Area */}
          <div
            className="p-6 sm:p-8 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{
              backgroundColor: '#FFF1F1',
              borderColor: '#F4B6B6',
            }}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: '#D94A4A' }}
                >
                  {hospital.type}
                </span>
                <span className="text-slate-300">·</span>
                {hospital.emergency ? (
                  <span
                    className="text-xs font-bold text-white px-2.5 py-0.5 rounded-full flex items-center gap-1"
                    style={{ backgroundColor: '#9E2020' }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-white" />
                    24x7 Emergency Ready
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Day OPD Center
                  </span>
                )}
              </div>

              <h1
                className="font-['Outfit'] font-bold text-2xl sm:text-3xl"
                style={{ color: '#252525' }}
              >
                {hospital.name}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#D94A4A' }} />
                <span>{hospital.location}, {hospital.city}</span>
                <span aria-hidden="true">·</span>
                <span className="font-bold tabular-nums" style={{ color: '#2E9B68' }}>
                  {hospital.distance} from center
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${hospital.name} ${hospital.location}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-colors bg-white hover:bg-slate-50"
                style={{ color: '#252525', borderColor: '#F4B6B6' }}
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <button
                type="button"
                onClick={() => setIsBedModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs transition-transform active:scale-98"
                style={{ backgroundColor: '#D94A4A' }}
              >
                <HeartPulse className="w-4 h-4" />
                <span>Request Bed Reservation</span>
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Bed Availability Tracker Box */}
            <div
              className="border rounded-2xl p-5 space-y-3"
              style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="font-['Outfit'] font-bold text-base flex items-center gap-2"
                  style={{ color: '#252525' }}
                >
                  <Bed className="w-4 h-4" style={{ color: '#D94A4A' }} />
                  <span>Bed Availability & Critical Care</span>
                </h3>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: '#FFF1F1',
                    color: '#2E9B68',
                    borderColor: '#2E9B68',
                  }}
                >
                  Verified Status
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">General Beds</span>
                  <span
                    className="font-['Outfit'] font-bold text-2xl tabular-nums"
                    style={{ color: '#252525' }}
                  >
                    {hospital.generalBeds}
                  </span>
                  <span className="text-[11px] font-bold block mt-0.5" style={{ color: '#2E9B68' }}>
                    Available for OPD/IPD
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">ICU / CCU Beds</span>
                  <span
                    className="font-['Outfit'] font-bold text-2xl tabular-nums"
                    style={{ color: '#252525' }}
                  >
                    {hospital.icuBeds}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Critical Monitoring</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">Oxygen Facility</span>
                  <span
                    className="font-['Outfit'] font-bold text-2xl"
                    style={{ color: hospital.oxygenAvailable ? '#2E9B68' : '#E9A23B' }}
                  >
                    {hospital.oxygenAvailable ? 'Ready' : 'Limited'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Central Supply</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic pt-1">
                {hospital.demoBadge}
              </p>
            </div>

            {/* Departments & Facilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              
              {/* Departments */}
              <div className="space-y-3">
                <h4
                  className="font-['Outfit'] font-bold text-base"
                  style={{ color: '#252525' }}
                >
                  Clinical Departments
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {hospital.departments.map((dept, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg border"
                      style={{
                        backgroundColor: '#FFF1F1',
                        borderColor: '#F4B6B6',
                        color: '#252525',
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#D94A4A' }} />
                      <span>{dept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Facilities & Contact */}
              <div className="space-y-4">
                <div>
                  <h4
                    className="font-['Outfit'] font-bold text-base mb-2"
                    style={{ color: '#252525' }}
                  >
                    Hospital Amenities
                  </h4>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {hospital.facilities.map((fac, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md border text-xs"
                        style={{
                          backgroundColor: '#FFF9F9',
                          borderColor: '#F4B6B6',
                          color: '#252525',
                        }}
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Emergency Hotline */}
                <div
                  className="border rounded-xl p-4 text-xs space-y-1"
                  style={{
                    backgroundColor: '#FFF1F1',
                    borderColor: '#9E2020',
                    color: '#9E2020',
                  }}
                >
                  <span className="font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    Direct Hospital Contacts
                  </span>
                  <p>Emergency Desk: <strong className="font-mono">{hospital.emergencyContact}</strong></p>
                  <p>Ambulance Dispatch: <strong className="font-mono">{hospital.ambulanceContact}</strong></p>
                </div>
              </div>

            </div>

            {/* Verification Notice */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#2E9B68' }} />
              <span>Verified regional hospital directory. Telemetry synced for clinical navigation.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
