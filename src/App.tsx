import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DevelopmentRoleSwitcher } from './components/DevelopmentRoleSwitcher';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsStrip } from './components/StatsStrip';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ProcessTimeline } from './components/ProcessTimeline';
import { GallerySection } from './components/GallerySection';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { TestimonialsSection } from './components/TestimonialsSection';
import { SpecialOffer } from './components/SpecialOffer';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingCTAs } from './components/FloatingCTAs';
import { LegalModal } from './components/LegalModal';
import { Toast } from './components/Toast';

// Full platform components
import { BookingWizard } from './components/BookingWizard';
import { ServiceTracker } from './components/ServiceTracker';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import { ServicesPage } from './components/ServicesPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';

// Home Page Component preserving exact marketing layout
function HomePage({
  selectedService,
  onSelectService,
  onBookingSuccess,
  scrollToSection,
}: {
  selectedService: string;
  onSelectService: (serviceName: string) => void;
  onBookingSuccess: (bookingId: string) => void;
  scrollToSection: (sectionId: string) => void;
}) {
  return (
    <main className="flex-1">
      {/* Cinematic Hero */}
      <Hero
        onBookClick={() => scrollToSection('booking')}
        onExploreServices={() => scrollToSection('services')}
      />

      {/* Animated Numbers / Stats Strip */}
      <StatsStrip />

      {/* Services Section */}
      <ServicesSection onSelectService={onSelectService} />

      {/* About Garage / Split-Screen Tech Facility */}
      <AboutSection />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Before & After Interactive Draggable Slider */}
      <BeforeAfterSlider />

      {/* Our Work / Masonry Garage Gallery */}
      <GallerySection />

      {/* Testimonials Carousel */}
      <TestimonialsSection />

      {/* Special Offer Promotional Callout */}
      <SpecialOffer onBookClick={() => scrollToSection('booking')} />

      {/* Interactive Service Booking Form */}
      <BookingSection
        preselectedService={selectedService}
        onBookingSuccess={onBookingSuccess}
      />

      {/* Contact & Location Section */}
      <ContactSection />
    </main>
  );
}

// Standalone Booking Page wrapper
function StandaloneBookingPage() {
  return (
    <div className="pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6 text-center">
        <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500] px-3 py-1 rounded bg-[#ff5500]/10 border border-[#ff5500]/25">
          TORQX Precision Booking Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-2">
          Configure Your Automotive Service
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Dynamic itemized quotes, genuine OEM add-on packages, and verified technician allocation.
        </p>
      </div>
      <BookingWizard />
    </div>
  );
}

export default function App() {
  const [selectedService, setSelectedService] = useState<string>('Periodic Service');
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const navOffset = 75;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSelectServiceFromCard = (serviceName: string) => {
    setSelectedService(serviceName);
    scrollToSection('booking');
    setToastMessage(`Selected "${serviceName}". Choose your preferred date & time.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleBookingSuccess = (bookingId: string) => {
    setToastMessage(`Service bay booked successfully! Token #${bookingId}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0c10] text-[#f1f3f7] flex flex-col selection:bg-[#ff5500] selection:text-white">
        {/* Development-only Floating Role Switcher Emulator */}
        <DevelopmentRoleSwitcher />

        {/* Top Sticky Transparent/Blurred Navbar */}
        <Navbar onBookClick={() => scrollToSection('booking')} />

        <div className="flex-1 pt-14">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  selectedService={selectedService}
                  onSelectService={handleSelectServiceFromCard}
                  onBookingSuccess={handleBookingSuccess}
                  scrollToSection={scrollToSection}
                />
              }
            />
            <Route path="/book-service" element={<StandaloneBookingPage />} />
            <Route path="/service/:bookingId" element={<ServiceTracker />} />
            
            {/* RBAC Protected Portals */}
            <Route
              path="/dashboard/*"
              element={
                <RoleProtectedRoute allowedRole="customer">
                  <CustomerDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <RoleProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/technician/*"
              element={
                <RoleProtectedRoute allowedRole="technician">
                  <TechnicianDashboard />
                </RoleProtectedRoute>
              }
            />

            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Premium Dark Footer */}
        <Footer
          onOpenLegal={(type) => setLegalModalType(type)}
          onSelectService={handleSelectServiceFromCard}
        />

        {/* Floating Action Buttons (WhatsApp, Scroll-To-Top, Mobile Bar) */}
        <FloatingCTAs onBookClick={() => scrollToSection('booking')} />

        {/* Legal Information Modal */}
        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />

        {/* Toast Notification */}
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </BrowserRouter>
  );
}
