import React, { useState } from 'react';
import { Doctor, Appointment } from '../types';
import { bookAppointment } from '../services/doctorService';
import { X, Calendar, Clock, User, Phone, CheckCircle, ShieldCheck } from 'lucide-react';

interface AppointmentModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (appointment: Appointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  doctor,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState(doctor.availableSlots[0] || '10:00 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppointment, setSubmittedAppointment] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;

    setIsSubmitting(true);
    try {
      const appt = await bookAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        patientName,
        patientPhone,
        date,
        timeSlot,
        notes,
      });

      setSubmittedAppointment(appt);
      if (onSuccess) {
        onSuccess(appt);
      }
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedAppointment ? (
          /* Confirmation Success State */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border"
              style={{ backgroundColor: '#FFF1F1', color: '#2E9B68', borderColor: '#2E9B68' }}
            >
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#2E9B68' }}>
                Booking Confirmed
              </span>
              <h3 className="font-['Outfit'] font-bold text-2xl" style={{ color: '#252525' }}>
                Appointment Confirmed
              </h3>
              <p className="text-sm text-slate-600">
                Your consultation request with <strong style={{ color: '#252525' }}>{doctor.name}</strong> is scheduled.
              </p>
            </div>

            <div
              className="border rounded-2xl p-4 text-xs text-left space-y-2"
              style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
            >
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold" style={{ color: '#252525' }}>{submittedAppointment.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-semibold" style={{ color: '#252525' }}>{submittedAppointment.date} at {submittedAppointment.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Clinic / Hospital:</span>
                <span className="font-semibold" style={{ color: '#252525' }}>{doctor.hospitalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-mono font-bold" style={{ color: '#D94A4A' }}>{submittedAppointment.id}</span>
              </div>
            </div>

            <div
              className="p-3 rounded-xl text-xs flex items-center gap-2 border"
              style={{ backgroundColor: '#FFF1F1', borderColor: '#F4B6B6', color: '#252525' }}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#2E9B68' }} />
              <span>
                Please arrive 15 minutes before your scheduled slot. Show your reference code at the clinic reception.
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 text-white font-bold text-sm rounded-xl transition-all shadow-xs hover:bg-[#A83232]"
              style={{ backgroundColor: '#D94A4A' }}
            >
              Done
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#D94A4A' }}>
                Doctor Appointment
              </span>
              <h3 className="font-['Outfit'] font-bold text-xl sm:text-2xl mt-0.5" style={{ color: '#252525' }}>
                Book Consultation
              </h3>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-medium" style={{ color: '#252525' }}>{doctor.name}</span>
                <span aria-hidden="true">·</span>
                <span>{doctor.specialty}</span>
                <span aria-hidden="true">·</span>
                <span className="font-bold" style={{ color: '#D94A4A' }}>₹{doctor.fee}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#252525' }}>
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6]"
                    style={{ borderColor: '#F4B6B6', color: '#252525' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#252525' }}>
                  Phone Number (for SMS & Verification) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6]"
                    style={{ borderColor: '#F4B6B6', color: '#252525' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#252525' }}>
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6]"
                      style={{ borderColor: '#F4B6B6', color: '#252525' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#252525' }}>
                    Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] bg-white"
                      style={{ borderColor: '#F4B6B6', color: '#252525' }}
                    >
                      {doctor.availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#252525' }}>
                  Health Concern / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mild fever and body ache since 2 days"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6]"
                  style={{ borderColor: '#F4B6B6', color: '#252525' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-xs transition-colors hover:bg-[#A83232]"
                style={{ backgroundColor: '#D94A4A' }}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
