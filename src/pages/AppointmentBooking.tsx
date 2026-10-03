import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Doctor, Appointment } from '../types';
import { fetchDoctors } from '../services/doctorService';
import { bookAppointmentDemo } from '../services/appointmentService';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  HeartPulse,
  LayoutDashboard,
  CalendarCheck,
  Search,
  Star,
  CheckCircle2,
} from 'lucide-react';

const TIME_SLOTS = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
];

const APPOINTMENT_TYPES = [
  'General Consultation',
  'Specialist Referral',
  'Follow-up Visit',
  'Preventive Health Check',
  'Emergency Assessment',
];

export const AppointmentBooking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctorId || '');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Form Fields
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [appointmentType, setAppointmentType] = useState('General Consultation');
  const [notes, setNotes] = useState('');

  // Calendar State (Defaults to current month)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 3)); // Oct 2026
  const [selectedDate, setSelectedDate] = useState<number>(15);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('2:00 PM');

  // UI state
  const [viewMode, setViewMode] = useState<'form' | 'doctorList'>('form');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchDoctors().then((docs) => {
      setDoctors(docs);
      if (preselectedDoctorId) {
        const found = docs.find((d) => d.id === preselectedDoctorId);
        if (found) {
          setSelectedDoctorId(found.id);
          setSelectedDoctor(found);
        }
      } else if (docs.length > 0) {
        setSelectedDoctorId(docs[0].id);
        setSelectedDoctor(docs[0]);
      }
    });
  }, [preselectedDoctorId]);

  useEffect(() => {
    if (selectedDoctorId) {
      const found = doctors.find((d) => d.id === selectedDoctorId);
      if (found) setSelectedDoctor(found);
    }
  }, [selectedDoctorId, doctors]);

  // Calendar generation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone) return;

    setIsSubmitting(true);
    try {
      const dateStr = `${selectedDate} ${monthNames[month]} ${year}`;
      const res = await bookAppointmentDemo({
        doctorId: selectedDoctorId,
        doctorName: selectedDoctor?.name,
        patientName,
        patientPhone: phone,
        date: dateStr,
        timeSlot: selectedTimeSlot,
        notes: `Type: ${appointmentType} | Age: ${age} | Email: ${email} | Notes: ${notes}`,
      });

      setConfirmedBooking(res);
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(doctorSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: '#FFF9F9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Dashboard Card Wrapper */}
        <div
          className="rounded-3xl border shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[750px]"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
        >
          {/* Left Sidebar */}
          <aside
            className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r p-6 flex flex-col justify-between"
            style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
          >
            <div className="space-y-6">
              
              {/* Sidebar Header Brand */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: '#D94A4A' }}
                >
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-['Outfit'] font-bold text-lg block leading-none" style={{ color: '#252525' }}>
                    CAREPATH
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: '#A83232' }}>
                    Appointments
                  </span>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <nav className="space-y-1.5 text-xs font-semibold">
                <Link
                  to="/guidance"
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:text-[#252525] hover:bg-[#FFF1F1] transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>AI Health Assistant</span>
                </Link>

                <Link
                  to="/doctors"
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:text-[#252525] hover:bg-[#FFF1F1] transition-all"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Find Doctors</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setViewMode('doctorList')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    viewMode === 'doctorList'
                      ? 'bg-[#FFF1F1] text-[#D94A4A] font-bold'
                      : 'text-slate-600 hover:bg-[#FFF1F1] hover:text-[#252525]'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Doctor Directory</span>
                </button>

                {/* Active Book Appointment Item */}
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white font-bold transition-all shadow-xs hover:bg-[#A83232]"
                  style={{ backgroundColor: '#D94A4A' }}
                >
                  <CalendarIcon className="w-4 h-4 text-white" />
                  <span>Schedule Appointment</span>
                </button>
              </nav>

            </div>

            {/* Sidebar Brand Footer */}
            <div className="pt-8 border-t space-y-1 text-[11px] text-slate-500" style={{ borderColor: '#F4B6B6' }}>
              <span className="font-bold block" style={{ color: '#252525' }}>CAREPATH</span>
              <p>From Referral to the Right Care</p>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-x-hidden">
            
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: '#F4B6B6' }}>
              <div>
                <h1 className="font-['Outfit'] font-bold text-2xl sm:text-3xl" style={{ color: '#252525' }}>
                  Schedule Appointment
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Book verified consultations with certified medical specialists in your area
                </p>
              </div>

              {/* View Toggle */}
              <div
                className="flex items-center gap-1.5 p-1 rounded-xl border self-start sm:self-auto"
                style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'form'
                      ? 'bg-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-[#252525]'
                  }`}
                  style={{ color: viewMode === 'form' ? '#D94A4A' : '#252525' }}
                >
                  Schedule Form
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('doctorList')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'doctorList'
                      ? 'bg-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-[#252525]'
                  }`}
                  style={{ color: viewMode === 'doctorList' ? '#D94A4A' : '#252525' }}
                >
                  Doctor Grid View
                </button>
              </div>
            </div>

            {/* Confirmation State if just booked */}
            {confirmedBooking ? (
              <div
                className="border rounded-3xl p-8 text-center space-y-4 animate-fadeIn"
                style={{ backgroundColor: '#FFF1F1', borderColor: '#F4B6B6' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-xs"
                  style={{ backgroundColor: '#2E9B68' }}
                >
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: '#2E9B68' }}
                  >
                    Appointment Confirmed
                  </span>
                  <h3 className="font-['Outfit'] font-bold text-2xl" style={{ color: '#252525' }}>
                    Scheduled with {selectedDoctor?.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Patient: <strong>{confirmedBooking.patientName}</strong> · Date: <strong>{confirmedBooking.date}</strong> at <strong>{confirmedBooking.timeSlot}</strong>
                  </p>
                </div>

                <div
                  className="bg-white border rounded-2xl p-4 max-w-md mx-auto text-xs text-left space-y-2"
                  style={{ borderColor: '#F4B6B6' }}
                >
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booking Reference:</span>
                    <span className="font-mono font-bold" style={{ color: '#D94A4A' }}>{confirmedBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor / Hospital:</span>
                    <span className="font-semibold" style={{ color: '#252525' }}>{selectedDoctor?.hospitalName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consultation Fee:</span>
                    <span className="font-bold text-sm" style={{ color: '#D94A4A' }}>₹{selectedDoctor?.fee}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmedBooking(null);
                      setPatientName('');
                      setPhone('');
                      setEmail('');
                      setAge('');
                      setNotes('');
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs hover:bg-[#A83232]"
                    style={{ backgroundColor: '#D94A4A' }}
                  >
                    Book Another Appointment
                  </button>
                  <Link
                    to="/doctors"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white border hover:bg-slate-50 transition-colors"
                    style={{ color: '#252525', borderColor: '#F4B6B6' }}
                  >
                    Back to Doctors
                  </Link>
                </div>
              </div>
            ) : viewMode === 'form' ? (
              
              /* SCHEDULE APPOINTMENT FORM */
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Form Area (Appointment Details) */}
                <div
                  className="lg:col-span-7 bg-white rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xs"
                  style={{ borderColor: '#F4B6B6' }}
                >
                  <div className="border-b pb-2" style={{ borderColor: '#F4B6B6' }}>
                    <h3 className="font-['Outfit'] font-bold text-lg" style={{ color: '#252525' }}>
                      Appointment Details
                    </h3>
                  </div>

                  {/* 1. Patient Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#252525' }}>
                      <User className="w-4 h-4" style={{ color: '#D94A4A' }} />
                      <span>Patient Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Patient full name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Anand Deshmukh"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] bg-white"
                          style={{ borderColor: '#F4B6B6', color: '#252525' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Email address (optional)
                        </label>
                        <input
                          type="email"
                          placeholder="patient@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] bg-white"
                          style={{ borderColor: '#F4B6B6', color: '#252525' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Phone number *
                        </label>
                        <div
                          className="flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F4B6B6] bg-white"
                          style={{ borderColor: '#F4B6B6' }}
                        >
                          <span
                            className="px-3 py-2.5 text-xs font-semibold border-r"
                            style={{ backgroundColor: '#FFF1F1', color: '#252525', borderColor: '#F4B6B6' }}
                          >
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            placeholder="98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2.5 text-xs sm:text-sm focus:outline-none bg-transparent"
                            style={{ color: '#252525' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Patient Age
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 42"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] bg-white"
                          style={{ borderColor: '#F4B6B6', color: '#252525' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Appointment Details (Type & Doctor) */}
                  <div className="space-y-4 pt-4 border-t" style={{ borderColor: '#F4B6B6' }}>
                    <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#252525' }}>
                      <CalendarIcon className="w-4 h-4" style={{ color: '#D94A4A' }} />
                      <span>Consultation Selection</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Appointment type
                        </label>
                        <select
                          value={appointmentType}
                          onChange={(e) => setAppointmentType(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] bg-white font-medium"
                          style={{ borderColor: '#F4B6B6', color: '#252525' }}
                        >
                          {APPOINTMENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Select doctor
                        </label>
                        <select
                          value={selectedDoctorId}
                          onChange={(e) => setSelectedDoctorId(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] bg-white font-medium"
                          style={{ borderColor: '#F4B6B6', color: '#252525' }}
                        >
                          {doctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name} — {doc.specialty} (₹{doc.fee})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 3. Additional Notes */}
                  <div className="space-y-3 pt-4 border-t" style={{ borderColor: '#F4B6B6' }}>
                    <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#252525' }}>
                      <FileText className="w-4 h-4" style={{ color: '#D94A4A' }} />
                      <span>Symptoms & Notes</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Health Concern Notes (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe current symptoms or past medications..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] bg-white"
                        style={{ borderColor: '#F4B6B6', color: '#252525' }}
                      />
                    </div>
                  </div>

                </div>

                {/* Right Column: Calendar, Time Slots & Summary */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Select Date Widget */}
                  <div
                    className="bg-white rounded-3xl border p-5 space-y-4 shadow-xs"
                    style={{ borderColor: '#F4B6B6' }}
                  >
                    <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#252525' }}>
                      <CalendarIcon className="w-4 h-4" style={{ color: '#D94A4A' }} />
                      <span>Select Date</span>
                    </div>

                    {/* Month Navigator */}
                    <div className="flex items-center justify-between px-2">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-['Outfit'] font-bold text-sm" style={{ color: '#252525' }}>
                        {monthNames[month]} {year}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        aria-label="Next month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`blank-${i}`} className="p-2" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNumber = i + 1;
                        const isSelected = selectedDate === dayNumber;
                        return (
                          <button
                            key={dayNumber}
                            type="button"
                            onClick={() => setSelectedDate(dayNumber)}
                            className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                              isSelected
                                ? 'text-white shadow-xs font-bold'
                                : 'text-slate-700 hover:bg-[#FFF1F1] hover:text-[#D94A4A]'
                            }`}
                            style={{
                              backgroundColor: isSelected ? '#D94A4A' : 'transparent',
                            }}
                          >
                            {dayNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available Times Widget */}
                  <div
                    className="bg-white rounded-3xl border p-5 space-y-4 shadow-xs"
                    style={{ borderColor: '#F4B6B6' }}
                  >
                    <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#252525' }}>
                      <Clock className="w-4 h-4" style={{ color: '#D94A4A' }} />
                      <span>Available Time Slot</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedTimeSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                              isSelected
                                ? 'text-white shadow-xs'
                                : 'text-slate-700 bg-white hover:bg-[#FFF1F1]'
                            }`}
                            style={{
                              backgroundColor: isSelected ? '#D94A4A' : '#FFFFFF',
                              borderColor: isSelected ? '#D94A4A' : '#F4B6B6',
                            }}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Appointment Summary Box */}
                  <div
                    className="rounded-3xl border p-5 space-y-3"
                    style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6' }}
                  >
                    <h4 className="font-['Outfit'] font-bold text-sm" style={{ color: '#252525' }}>
                      Appointment Summary
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Doctor:</span>
                        <span className="font-semibold" style={{ color: '#252525' }}>
                          {selectedDoctor?.name || 'Please select a doctor'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Specialty:</span>
                        <span>{selectedDoctor?.specialty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date:</span>
                        <span className="font-semibold" style={{ color: '#252525' }}>
                          {selectedDate} {monthNames[month]} {year}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Time:</span>
                        <span className="font-semibold" style={{ color: '#252525' }}>{selectedTimeSlot}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t" style={{ borderColor: '#F4B6B6' }}>
                        <span className="text-slate-500">Consultation Fee:</span>
                        <span className="font-bold text-sm tabular-nums" style={{ color: '#D94A4A' }}>
                          ₹{selectedDoctor?.fee || 500}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-xs mt-2 flex items-center justify-center gap-2 hover:bg-[#A83232]"
                      style={{ backgroundColor: '#D94A4A' }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSubmitting ? 'Confirming...' : 'Confirm Appointment'}</span>
                    </button>
                  </div>

                </div>

              </form>
            ) : (

              /* DOCTOR DIRECTORY & LIST VIEW */
              <div className="space-y-6">
                
                {/* Search Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Doctor by name or specialty..."
                      value={doctorSearchQuery}
                      onChange={(e) => setDoctorSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B6B6] bg-white"
                      style={{ borderColor: '#F4B6B6', color: '#252525' }}
                    />
                  </div>

                  <span className="text-xs text-slate-500">
                    Showing {filteredDoctors.length} available specialists
                  </span>
                </div>

                {/* 2-Column Doctor List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-3xl border p-5 flex items-start justify-between gap-4 hover:border-[#D94A4A] transition-all shadow-xs"
                      style={{ borderColor: '#F4B6B6' }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-white shrink-0"
                          style={{ backgroundColor: '#D94A4A' }}
                        >
                          {doc.name
                            .split(' ')
                            .map((n) => n[0])
                            .filter((_, i) => i < 2)
                            .join('')}
                        </div>
                        <div>
                          <h4 className="font-['Outfit'] font-bold text-sm" style={{ color: '#252525' }}>
                            {doc.name}
                          </h4>
                          <p className="text-xs font-semibold" style={{ color: '#D94A4A' }}>{doc.specialty}</p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {doc.qualification} · <strong style={{ color: '#252525' }}>₹{doc.fee}/visit</strong>
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{doc.rating} ({doc.reviews})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDoctorId(doc.id);
                            setViewMode('form');
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all shadow-xs hover:bg-[#A83232]"
                          style={{ backgroundColor: '#D94A4A' }}
                        >
                          Book Now
                        </button>
                        <Link
                          to={`/doctors/${doc.id}`}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-[#252525] bg-slate-50 rounded-lg text-center"
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
