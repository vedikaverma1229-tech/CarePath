import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

export const Footer: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <footer
      className="text-slate-300 pt-12 pb-8 mt-auto border-t"
      style={{ backgroundColor: '#252525', borderColor: '#383838' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Emergency & Guidance Banner */}
        <div
          className="mb-10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border"
          style={{ backgroundColor: '#1C1C1C', borderColor: '#A83232' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#FFF1F1', color: '#D94A4A' }}
          >
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span
              className="text-xs uppercase font-bold tracking-wider block mb-0.5"
              style={{ color: '#F4B6B6' }}
            >
              Emergency & Medical Notice
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              CarePath provides healthcare guidance and navigation support. In case of acute chest pain, trauma, or life-threatening symptoms, immediately dial 112 or visit the nearest emergency trauma center.
            </p>
          </div>
          <Link
            to="/emergency"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl transition-all whitespace-nowrap shadow-xs hover:bg-[#A83232]"
            style={{ backgroundColor: '#9E2020' }}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency 112</span>
          </Link>
        </div>

        {/* Professional 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-neutral-800">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: '#D94A4A' }}
              >
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-['Outfit'] font-bold text-xl tracking-tight text-white">
                CAREPATH
              </span>
            </div>
            <p className="text-xs font-bold" style={{ color: '#F4B6B6' }}>
              From Referral to the Right Care
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering patients across Tier-2, Tier-3, and rural communities to understand symptoms, choose the right healthcare specialist, and locate verified nearby care.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-3">
              Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/guidance" className="text-slate-300 hover:text-white transition-colors">
                  AI Health Assistant
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-slate-300 hover:text-white transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-slate-300 hover:text-white transition-colors">
                  Appointments
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="text-slate-300 hover:text-white transition-colors">
                  Hospitals & Beds
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="font-bold hover:underline" style={{ color: '#D94A4A' }}>
                  Emergency
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-3">
              Support
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Help & Support
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Terms of Guidance
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Medical Disclaimer
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Supported Languages */}
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-3">
              Supported Languages
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                  language === 'en'
                    ? 'border-[#D94A4A] text-white bg-[#D94A4A]/20'
                    : 'border-neutral-800 text-slate-400 hover:text-white bg-neutral-900/50'
                }`}
              >
                <span>English</span>
                {language === 'en' && <span className="text-[10px] text-[#F4B6B6]">Active</span>}
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                  language === 'hi'
                    ? 'border-[#D94A4A] text-white bg-[#D94A4A]/20'
                    : 'border-neutral-800 text-slate-400 hover:text-white bg-neutral-900/50'
                }`}
              >
                <span>हिंदी (Hindi)</span>
                {language === 'hi' && <span className="text-[10px] text-[#F4B6B6]">Active</span>}
              </button>
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                  language === 'mr'
                    ? 'border-[#D94A4A] text-white bg-[#D94A4A]/20'
                    : 'border-neutral-800 text-slate-400 hover:text-white bg-neutral-900/50'
                }`}
              >
                <span>मराठी (Marathi)</span>
                {language === 'mr' && <span className="text-[10px] text-[#F4B6B6]">Active</span>}
              </button>
            </div>
          </div>

        </div>

        {/* Medical Disclaimer & Copyright */}
        <div className="pt-6 space-y-3">
          <p className="text-xs text-slate-400 text-center sm:text-left leading-relaxed">
            <strong className="text-slate-300">Medical Disclaimer:</strong> “CarePath provides healthcare guidance and navigation support. It does not replace professional medical diagnosis or treatment.”
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 border-t border-neutral-800 gap-2">
            <p>© 2026 CAREPATH. All rights reserved.</p>
            <p className="text-[11px] text-slate-500">From Referral to the Right Care</p>
          </div>
        </div>

      </div>
    </footer>
  );
};
