import React, { useState } from 'react';
import { Hospital, BedRequest } from '../types';
import { requestHospitalBed } from '../services/hospitalService';
import { X, Bed, User, Phone, CheckCircle, ShieldAlert } from 'lucide-react';

interface BedRequestModalProps {
  hospital: Hospital;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (request: BedRequest) => void;
}

export const BedRequestModal: React.FC<BedRequestModalProps> = ({
  hospital,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [department, setDepartment] = useState(hospital.departments[0] || 'General Medicine');
  const [bedType, setBedType] = useState<'general' | 'icu' | 'oxygen'>('general');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<BedRequest | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;

    setIsSubmitting(true);
    try {
      const req = await requestHospitalBed({
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        patientName,
        patientPhone,
        department,
        bedType,
        notes,
      });

      setSubmittedRequest(req);
      if (onSuccess) {
        onSuccess(req);
      }
    } catch (err) {
      console.error('Bed request failed:', err);
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
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedRequest ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border"
              style={{ backgroundColor: '#FFF1F1', color: '#2E9B68', borderColor: '#2E9B68' }}
            >
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#2E9B68' }}>
                Bed Request Logged
              </span>
              <h3 className="font-['Outfit'] font-bold text-2xl" style={{ color: '#252525' }}>
                Bed Assistance Request Submitted
              </h3>
              <p className="text-sm text-slate-600">
                Bed coordination request registered for <strong style={{ color: '#252525' }}>{hospital.name}</strong>.
              </p>
            </div>

            <div
              className="border rounded-2xl p-4 text-xs text-left space-y-2"
              style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
            >
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold" style={{ color: '#252525' }}>{submittedRequest.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold" style={{ color: '#252525' }}>{submittedRequest.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bed Type:</span>
                <span className="font-semibold capitalize" style={{ color: '#252525' }}>{submittedRequest.bedType} Bed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Reference:</span>
                <span className="font-mono font-bold" style={{ color: '#D94A4A' }}>{submittedRequest.id}</span>
              </div>
            </div>

            <div
              className="p-3 rounded-xl text-xs flex items-center gap-2 border"
              style={{ backgroundColor: '#FFF1F1', borderColor: '#F4B6B6', color: '#252525' }}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" style={{ color: '#E9A23B' }} />
              <span>
                The admission desk will contact you on <strong>{submittedRequest.contact}</strong> to confirm admission clearance.
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
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#D94A4A' }}>
                Hospital Bed Coordination
              </span>
              <h3 className="font-['Outfit'] font-bold text-xl sm:text-2xl mt-0.5" style={{ color: '#252525' }}>
                Request Bed Assistance
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {hospital.name} · {hospital.location}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#252525' }}>
                  Patient Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Patient full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6]"
                    style={{ borderColor: '#F4B6B6', color: '#252525' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#252525' }}>
                  Contact Phone Number *
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
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] bg-white"
                    style={{ borderColor: '#F4B6B6', color: '#252525' }}
                  >
                    {hospital.departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#252525' }}>
                    Bed Type
                  </label>
                  <div className="relative">
                    <Bed className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={bedType}
                      onChange={(e) => setBedType(e.target.value as any)}
                      className="w-full pl-9 pr-2 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] bg-white"
                      style={{ borderColor: '#F4B6B6', color: '#252525' }}
                    >
                      <option value="general">General Bed ({hospital.generalBeds} avail)</option>
                      <option value="icu">ICU Bed ({hospital.icuBeds} avail)</option>
                      <option value="oxygen">Oxygen Supported Bed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-xs transition-colors hover:bg-[#A83232]"
                style={{ backgroundColor: '#D94A4A' }}
              >
                {isSubmitting ? 'Submitting...' : 'Request Bed Assistance'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
