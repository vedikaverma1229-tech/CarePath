import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDoctorById } from '../services/doctorService';
import { Doctor } from '../types';
import { AppointmentModal } from '../components/AppointmentModal';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Languages,
  Award,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDoctorById(id).then((doc) => {
        setDoctor(doc);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-500">
        Loading doctor profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold" style={{ color: '#252525' }}>
          Doctor Profile Not Found
        </h2>
        <Link
          to="/doctors"
          className="text-sm font-semibold hover:underline"
          style={{ color: '#D94A4A' }}
        >
          ← Back to Doctor Directory
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
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline"
          style={{ color: '#252525' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctors Directory</span>
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
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 rounded-2xl text-white flex items-center justify-center font-bold text-2xl shadow-sm"
                style={{ backgroundColor: '#D94A4A' }}
              >
                {doctor.name
                  .split(' ')
                  .map((n) => n[0])
                  .filter((_, i) => i < 2)
                  .join('')}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: '#D94A4A' }}
                  >
                    {doctor.specialty}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#2E9B68',
                      borderColor: '#2E9B68',
                    }}
                  >
                    {doctor.availability}
                  </span>
                </div>
                <h1
                  className="font-['Outfit'] font-bold text-2xl sm:text-3xl mt-0.5"
                  style={{ color: '#252525' }}
                >
                  {doctor.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {doctor.qualification} · <span className="tabular-nums font-semibold">{doctor.experience} Years of Clinical Practice</span>
                </p>
              </div>
            </div>

            {/* Fee & Action */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200 gap-3">
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                  Consultation Fee
                </span>
                <span
                  className="font-['Outfit'] font-extrabold text-2xl tabular-nums"
                  style={{ color: '#252525' }}
                >
                  ₹{doctor.fee}
                </span>
              </div>

              <Link
                to={`/appointments?doctorId=${doctor.id}`}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl shadow-xs transition-all hover:opacity-95"
                style={{ backgroundColor: '#D94A4A' }}
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book Appointment</span>
              </Link>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* About / Clinical Focus */}
            <div className="space-y-2">
              <h3
                className="font-['Outfit'] font-bold text-base"
                style={{ color: '#252525' }}
              >
                About the Practitioner
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {doctor.about}
              </p>
            </div>

            {/* Hospital / Clinic Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div
                className="p-4 rounded-2xl border space-y-1"
                style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
              >
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Primary Clinic / Hospital
                </span>
                <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#252525' }}>
                  <Building2 className="w-4 h-4" style={{ color: '#D94A4A' }} />
                  <span>{doctor.hospitalName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 pl-6">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doctor.location}, {doctor.city} ({doctor.distance})</span>
                </div>
              </div>

              <div
                className="p-4 rounded-2xl border space-y-1"
                style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
              >
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Patient Feedback & Rating
                </span>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold tabular-nums" style={{ color: '#252525' }}>
                    {doctor.rating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-slate-500">
                    ({doctor.reviews} verified patient reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-600 pt-1">
                  <Languages className="w-3.5 h-3.5" style={{ color: '#D94A4A' }} />
                  <span>Languages: {doctor.languages.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Today / Upcoming Slot schedule */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3
                className="font-['Outfit'] font-bold text-base flex items-center gap-2"
                style={{ color: '#252525' }}
              >
                <Clock className="w-4 h-4" style={{ color: '#D94A4A' }} />
                <span>Available Consultation Slots</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.availableSlots.map((slot) => (
                  <Link
                    key={slot}
                    to={`/appointments?doctorId=${doctor.id}`}
                    className="px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      backgroundColor: '#FFF1F1',
                      color: '#D94A4A',
                      borderColor: '#F4B6B6',
                    }}
                  >
                    {slot}
                  </Link>
                ))}
              </div>
            </div>

            {/* Verification Notice */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4" style={{ color: '#2E9B68' }} />
              <span>Verified medical profile registered with regional healthcare administration.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
