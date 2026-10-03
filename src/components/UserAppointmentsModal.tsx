import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, User, Phone, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserAppointmentsModal: React.FC<UserAppointmentsModalProps> = ({ isOpen, onClose }) => {
  const { user, userAppointments, loadUserAppointments, signOut } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadUserAppointments();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
      >
        {/* Header */}
        <div
          className="p-5 sm:p-6 border-b flex items-center justify-between"
          style={{ backgroundColor: '#FFF1F1', borderColor: '#F4B6B6' }}
        >
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-10 h-10 rounded-full border-2 border-white shadow-xs"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center"
                style={{ backgroundColor: '#D94A4A' }}
              >
                {user?.displayName ? user.displayName[0] : 'P'}
              </div>
            )}
            <div>
              <h2 className="font-['Outfit'] font-bold text-lg" style={{ color: '#252525' }}>
                {user?.displayName || 'My Healthcare Profile'}
              </h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-['Outfit'] font-bold text-sm uppercase tracking-wider text-slate-500">
              Synced Appointments ({userAppointments.length})
            </h3>
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: '#FFF9F9',
                borderColor: '#2E9B68',
                color: '#2E9B68',
              }}
            >
              Firestore Synced
            </span>
          </div>

          {userAppointments.length === 0 ? (
            <div
              className="p-8 rounded-2xl border text-center space-y-3"
              style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
            >
              <Calendar className="w-10 h-10 mx-auto" style={{ color: '#D94A4A' }} />
              <h4 className="font-bold text-sm" style={{ color: '#252525' }}>
                No appointments booked yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our Central India doctor network and book verified in-person or clinic consultations.
              </p>
              <Link
                to="/doctors"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: '#D94A4A' }}
              >
                Find Doctors
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl border shadow-xs space-y-2.5 transition-all hover:border-[#D94A4A]"
                  style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#D94A4A' }}>
                        Confirmed Appointment
                      </span>
                      <h4 className="font-['Outfit'] font-bold text-sm sm:text-base" style={{ color: '#252525' }}>
                        {apt.doctorName || 'Specialist Consultation'}
                      </h4>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1"
                      style={{ backgroundColor: '#FFFFFF', color: '#2E9B68', border: '1px solid #2E9B68' }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" style={{ color: '#D94A4A' }} />
                      <span className="font-medium">{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" style={{ color: '#D94A4A' }} />
                      <span className="font-medium">{apt.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Patient: <strong>{apt.patientName}</strong> ({apt.patientPhone})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t flex items-center justify-between text-xs"
          style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
        >
          <button
            type="button"
            onClick={async () => {
              await signOut();
              onClose();
            }}
            className="text-slate-500 hover:text-red-600 font-semibold underline"
          >
            Sign Out of Account
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-white font-bold shadow-xs"
            style={{ backgroundColor: '#D94A4A' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
