import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { Menu, X, HeartPulse, AlertCircle, Globe, LogIn, Calendar, ShieldCheck, User } from 'lucide-react';
import { UserAppointmentsModal } from './UserAppointmentsModal';

export const Navbar: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signIn, userAppointments } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const navLinks = [
    { to: '/', label: t.navHome },
    { to: '/guidance', label: t.navGuidance },
    { to: '/doctors', label: t.navDoctors },
    { to: '/appointments', label: 'Appointments' },
    { to: '/hospitals', label: t.navHospitals },
    { to: '/emergency', label: t.navEmergency, isEmergency: true },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
    } catch (err) {
      console.warn('Google sign-in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-2 rounded-md"
            aria-label="CarePath Home"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
              style={{ backgroundColor: '#D94A4A' }}
            >
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span
                className="font-['Outfit'] font-bold text-xl sm:text-2xl tracking-tight leading-none"
                style={{ color: '#252525' }}
              >
                CAREPATH
              </span>
              <span
                className="text-[10px] font-semibold tracking-wide hidden sm:block"
                style={{ color: '#A83232' }}
              >
                From Referral to the Right Care
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              if (link.isEmergency) {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all shadow-xs ${
                      isActive
                        ? 'text-white opacity-100'
                        : 'text-white hover:opacity-90 active:scale-95'
                    }`}
                    style={{
                      backgroundColor: '#9E2020',
                    }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-white" />
                    <span>{link.label}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="transition-colors whitespace-nowrap pb-0.5 hover:text-[#D94A4A]"
                  style={{
                    color: isActive ? '#D94A4A' : '#252525',
                    borderBottom: isActive ? '2px solid #D94A4A' : '2px solid transparent',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Primary Actions & Firebase Auth */}
          <div className="flex items-center gap-3">
            {/* Multilingual Selector */}
            <div
              className="relative flex items-center rounded-lg px-2.5 py-1 text-xs font-medium border hidden sm:flex"
              style={{
                backgroundColor: '#FFF1F1',
                borderColor: '#F4B6B6',
                color: '#252525',
              }}
            >
              <Globe className="w-3.5 h-3.5 mr-1.5 shrink-0" style={{ color: '#D94A4A' }} />
              <select
                aria-label="Select Language"
                value={language}
                onChange={handleLanguageChange}
                className="bg-transparent text-xs font-semibold cursor-pointer focus:outline-none pr-1"
                style={{ color: '#252525' }}
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="mr">मराठी (MR)</option>
              </select>
            </div>

            {/* Google Authentication Control */}
            {user ? (
              <button
                type="button"
                onClick={() => setIsAppointmentsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:border-[#D94A4A] shadow-xs"
                style={{ backgroundColor: '#FFF9F9', borderColor: '#F4B6B6', color: '#252525' }}
                title="View Appointments & Records"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Profile'}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4" style={{ color: '#D94A4A' }} />
                )}
                <span className="max-w-[100px] truncate hidden md:inline">
                  {user.displayName?.split(' ')[0] || 'Account'}
                </span>
                {userAppointments.length > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center font-bold"
                    style={{ backgroundColor: '#D94A4A' }}
                  >
                    {userAppointments.length}
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:bg-slate-50 shadow-xs active:scale-95"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6', color: '#252525' }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isSigningIn ? 'Connecting...' : 'Sign in'}</span>
              </button>
            )}

            {/* Primary CTA: Talk to CarePath */}
            <Link
              to="/guidance"
              className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-bold text-white rounded-xl shadow-xs transition-all hover:bg-[#A83232] active:scale-98 whitespace-nowrap"
              style={{ backgroundColor: '#D94A4A' }}
            >
              {t.talkToCarepath}
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: '#252525' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-b px-4 pt-2 pb-6 space-y-3 shadow-lg"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F4B6B6' }}
          >
            <div className="flex flex-col space-y-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor:
                      location.pathname === link.to
                        ? '#FFF1F1'
                        : link.isEmergency
                        ? '#9E2020'
                        : 'transparent',
                    color:
                      location.pathname === link.to
                        ? '#D94A4A'
                        : link.isEmergency
                        ? '#FFFFFF'
                        : '#252525',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t space-y-2" style={{ borderColor: '#F4B6B6' }}>
              <Link
                to="/guidance"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-2.5 text-sm font-bold text-white rounded-xl shadow-xs hover:bg-[#A83232]"
                style={{ backgroundColor: '#D94A4A' }}
              >
                {t.talkToCarepath}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* User Appointments Modal */}
      <UserAppointmentsModal
        isOpen={isAppointmentsModalOpen}
        onClose={() => setIsAppointmentsModalOpen(false)}
      />
    </>
  );
};
