import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { HeartHero3D } from '../components/HeartHero3D';
import { DoctorCard } from '../components/DoctorCard';
import { HospitalCard } from '../components/HospitalCard';
import { LiveVoiceModal } from '../components/LiveVoiceModal';
import { fetchDoctors } from '../services/doctorService';
import { fetchHospitals } from '../services/hospitalService';
import { Doctor, Hospital } from '../types';
import {
  MessageSquare,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  Languages,
  Mic,
  AlertTriangle,
  Stethoscope,
  Building2,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Radio,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);
  const [featuredHospitals, setFeaturedHospitals] = useState<Hospital[]>([]);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);

  useEffect(() => {
    fetchDoctors({ city: 'Nagpur' }).then((docs) => setFeaturedDoctors(docs.slice(0, 3)));
    fetchHospitals({ city: 'Nagpur' }).then((hosps) => setFeaturedHospitals(hosps.slice(0, 2)));
  }, []);

  return (
    <div className="space-y-20 pb-16" style={{ backgroundColor: '#FFF9F9' }}>
      
      {/* =========================================================================
          SECTION 1 — HERO
          ========================================================================= */}
      <section
        className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 border-b"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#F4B6B6',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Hero Content & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left z-10">
              
              {/* Product Kicker */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: '#FFF1F1',
                  color: '#D94A4A',
                  borderColor: '#F4B6B6',
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D94A4A' }} />
                <span>Verified Healthcare Navigation</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1
                  className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]"
                  style={{ color: '#252525' }}
                >
                  CAREPATH
                </h1>
                <p
                  className="font-['Outfit'] font-bold text-xl sm:text-2xl"
                  style={{ color: '#D94A4A' }}
                >
                  From Referral to the Right Care
                </p>
              </div>

              {/* Supporting Subtext */}
              <p
                className="text-base sm:text-lg max-w-xl leading-relaxed font-medium"
                style={{ color: '#252525' }}
              >
                {t.heroSubtext}
              </p>

              {/* Primary, Live Voice, and Emergency CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Talk to CarePath button */}
                <Link
                  to="/guidance"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white shadow-md transition-all flex items-center gap-2 group hover:bg-[#A83232] active:scale-98"
                  style={{ backgroundColor: '#D94A4A' }}
                >
                  <MessageSquare className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>{t.talkToCarepath}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Real-Time Live Voice Button */}
                <button
                  onClick={() => setIsLiveVoiceOpen(true)}
                  className="px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base border shadow-xs transition-all flex items-center gap-2 hover:bg-[#FFF1F1]"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#D94A4A',
                    borderColor: '#F4B6B6',
                  }}
                >
                  <Radio className="w-4 h-4 animate-pulse text-[#D94A4A]" />
                  <span>Live Voice</span>
                </button>

                {/* Book Appointment CTA */}
                <Link
                  to="/appointments"
                  className="px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base border shadow-xs transition-all flex items-center gap-2 hover:bg-[#FFF1F1]"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#252525',
                    borderColor: '#F4B6B6',
                  }}
                >
                  <Calendar className="w-4 h-4" style={{ color: '#D94A4A' }} />
                  <span>Book Appointment</span>
                </Link>

                {/* Emergency CTA */}
                <Link
                  to="/emergency"
                  className="px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all flex items-center gap-1.5 shadow-xs hover:bg-[#A83232]"
                  style={{ backgroundColor: '#9E2020' }}
                >
                  <PhoneCall className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>{t.emergencyHelp}</span>
                </Link>
              </div>

              {/* Rural & Accessibility Trust Markers */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs border-t" style={{ borderColor: '#F4B6B6' }}>
                <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#252525' }}>
                  <Mic className="w-3.5 h-3.5" style={{ color: '#D94A4A' }} />
                  Voice-First Hindi, Marathi & English
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#2E9B68' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#2E9B68' }} />
                  Tier-2/3 & Rural Focused
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500">Accessible Web Experience</span>
              </div>
            </div>

            {/* Right Column: 3D Heart Visual */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <HeartHero3D />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — HOW CAREPATH WORKS (TALK, UNDERSTAND, GUIDE, CONNECT)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: '#D94A4A' }}
          >
            The Patient Story
          </span>
          <h2
            className="font-['Outfit'] font-bold text-2xl sm:text-3xl"
            style={{ color: '#252525' }}
          >
            {t.howItWorks}
          </h2>
          <p className="text-sm text-slate-600">
            A safe, understandable journey from your initial symptom to the right doctor or clinic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1: Talk */}
          <div
            className="rounded-3xl p-6 border shadow-xs hover:shadow-md transition-shadow relative space-y-3"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: '#FFF1F1', color: '#D94A4A' }}
            >
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-lg" style={{ color: '#252525' }}>
              {t.step1Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          {/* Step 2: Understand */}
          <div
            className="rounded-3xl p-6 border shadow-xs hover:shadow-md transition-shadow relative space-y-3"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: '#FFF1F1', color: '#D94A4A' }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-lg" style={{ color: '#252525' }}>
              {t.step2Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          {/* Step 3: Guide */}
          <div
            className="rounded-3xl p-6 border shadow-xs hover:shadow-md transition-shadow relative space-y-3"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: '#FFF1F1', color: '#D94A4A' }}
            >
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-lg" style={{ color: '#252525' }}>
              {t.step3Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.step3Desc}
            </p>
          </div>

          {/* Step 4: Connect */}
          <div
            className="rounded-3xl p-6 border shadow-xs hover:shadow-md transition-shadow relative space-y-3"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: '#FFF1F1', color: '#D94A4A' }}
            >
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-lg" style={{ color: '#252525' }}>
              {t.step4Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.step4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — WHY CAREPATH
          ========================================================================= */}
      <section
        className="py-16 border-y"
        style={{ backgroundColor: '#FFF1F1', borderColor: '#F4B6B6' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: '#D94A4A' }}
              >
                Bridging The Healthcare Divide
              </span>
              <h2
                className="font-['Outfit'] font-bold text-2xl sm:text-3xl leading-snug"
                style={{ color: '#252525' }}
              >
                {t.whyCarePath}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                In rural and small-town areas, patients often travel hours to district hospitals without knowing which doctor or department they actually need. CarePath provides clear, step-by-step guidance right from home.
              </p>
              
              <div className="pt-2">
                <Link
                  to="/guidance"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-xs hover:bg-[#A83232]"
                  style={{ backgroundColor: '#D94A4A' }}
                >
                  <span>Experience CarePath Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="p-5 rounded-3xl border shadow-xs space-y-2"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#FFF1F1', color: '#D94A4A' }}
                >
                  <Mic className="w-4 h-4" />
                </div>
                <h4 className="font-['Outfit'] font-bold text-base" style={{ color: '#252525' }}>
                  Voice Assistance
                </h4>
                <p className="text-xs text-slate-600">
                  Speak naturally in Hindi, Marathi, or English. CarePath listens, transcribes in real-time, and provides guidance.
                </p>
              </div>

              <div
                className="p-5 rounded-3xl border shadow-xs space-y-2"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#FFF1F1', color: '#D94A4A' }}
                >
                  <Languages className="w-4 h-4" />
                </div>
                <h4 className="font-['Outfit'] font-bold text-base" style={{ color: '#252525' }}>
                  Multilingual Fluency
                </h4>
                <p className="text-xs text-slate-600">
                  Complete bilingual support across Hindi (हिंदी), Marathi (मराठी) and English for full regional clarity.
                </p>
              </div>

              <div
                className="p-5 rounded-3xl border shadow-xs space-y-2"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#FFF1F1', color: '#9E2020' }}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h4 className="font-['Outfit'] font-bold text-base" style={{ color: '#252525' }}>
                  Emergency Escalation
                </h4>
                <p className="text-xs text-slate-600">
                  Immediate 112 & 108 emergency escalation with zero delay when acute danger symptoms appear.
                </p>
              </div>

              <div
                className="p-5 rounded-3xl border shadow-xs space-y-2"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#FFF1F1', color: '#D94A4A' }}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-['Outfit'] font-bold text-base" style={{ color: '#252525' }}>
                  Community Healthcare
                </h4>
                <p className="text-xs text-slate-600">
                  Find local PHCs, community health centers, district hospitals and private clinics suited to your needs.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — HEALTHCARE DISCOVERY PREVIEW
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: '#D94A4A' }}
            >
              Verified Regional Network
            </span>
            <h2
              className="font-['Outfit'] font-bold text-2xl sm:text-3xl"
              style={{ color: '#252525' }}
            >
              Featured Healthcare Providers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Transparent consultation fees, verified credentials and availability in Nagpur, Bhopal, and Indore.
            </p>
          </div>

          <Link
            to="/appointments"
            className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline self-start sm:self-auto"
            style={{ color: '#D94A4A' }}
          >
            <span>Book Appointment Platform →</span>
          </Link>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDoctors.map((doc, idx) => (
            <DoctorCard key={doc.id} doctor={doc} isBestMatch={idx === 0} />
          ))}
        </div>

        {/* Hospital Preview Row */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-['Outfit'] font-bold text-lg"
              style={{ color: '#252525' }}
            >
              Regional Hospitals & Beds Status
            </h3>
            <Link
              to="/hospitals"
              className="text-xs font-bold hover:underline"
              style={{ color: '#D94A4A' }}
            >
              View all hospitals →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredHospitals.map((hosp) => (
              <HospitalCard key={hosp.id} hospital={hosp} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — MULTILINGUAL SUPPORT
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-white rounded-3xl p-8 sm:p-12 shadow-md overflow-hidden relative"
          style={{ backgroundColor: '#A83232' }}
        >
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-[#FFF1F1]">
              Inclusive Healthcare Navigation
            </span>
            <h2 className="font-['Outfit'] font-bold text-2xl sm:text-4xl tracking-tight">
              {t.multilingualTitle}
            </h2>
            <p className="text-sm text-red-100 leading-relaxed">
              CarePath is built for users who prefer communicating in their mother tongue. Switch seamlessly between English, Hindi, and Marathi at any moment.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-3.5 py-1.5 rounded-lg bg-white/15 border border-white/20 text-xs font-bold">
                English
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-white/25 border border-white/30 text-xs font-bold text-[#FFF1F1]">
                हिंदी (Hindi)
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-white/15 border border-white/20 text-xs font-bold">
                मराठी (Marathi)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — SAFETY & MEDICAL BOUNDARY
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl border p-6 sm:p-8 text-center space-y-3 shadow-xs"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: '#FFF1F1', color: '#2E9B68' }}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3
            className="font-['Outfit'] font-bold text-lg sm:text-xl"
            style={{ color: '#252525' }}
          >
            Our Clinical Safety Principle
          </h3>
          <p
            className="text-sm font-semibold max-w-xl mx-auto leading-relaxed"
            style={{ color: '#252525' }}
          >
            “CarePath provides healthcare guidance and navigation support. It does not replace professional medical diagnosis or treatment.”
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            CarePath never writes prescriptions, calculates medicine dosages, or gives definitive diagnoses. We help you navigate smoothly to the right doctor or clinic.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — FINAL CTA
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="space-y-2">
          <h2
            className="font-['Outfit'] font-bold text-3xl sm:text-4xl tracking-tight"
            style={{ color: '#252525' }}
          >
            {t.finalCtaTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            {t.finalCtaSubtext}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/guidance"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white shadow-md transition-all hover:bg-[#A83232] active:scale-98 group"
            style={{ backgroundColor: '#D94A4A' }}
          >
            <MessageSquare className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            <span>{t.talkToCarepath}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-bold border transition-all hover:bg-[#FFF1F1]"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#252525',
              borderColor: '#F4B6B6',
            }}
          >
            <Calendar className="w-5 h-5" style={{ color: '#D94A4A' }} />
            <span>Schedule Appointment</span>
          </Link>
        </div>
      </section>

      {/* Live Voice Real-Time Modal */}
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />

    </div>
  );
};
