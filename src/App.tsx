import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Guidance } from './pages/Guidance';
import { Doctors } from './pages/Doctors';
import { DoctorProfile } from './pages/DoctorProfile';
import { Hospitals } from './pages/Hospitals';
import { HospitalProfile } from './pages/HospitalProfile';
import { Emergency } from './pages/Emergency';
import { AppointmentBooking } from './pages/AppointmentBooking';

// Helper component to scroll top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-[#FFF9F9] text-[#252525] font-['Plus_Jakarta_Sans',sans-serif]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guidance" element={<Guidance />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorProfile />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/hospitals/:id" element={<HospitalProfile />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/appointments" element={<AppointmentBooking />} />
              <Route path="/book-appointment" element={<AppointmentBooking />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
