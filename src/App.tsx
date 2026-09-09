import React, { useState } from 'react';
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
    <div className="min-h-screen bg-[#0a0c10] text-[#f1f3f7] flex flex-col selection:bg-[#ff5500] selection:text-white">
      {/* Top Sticky Transparent/Blurred Navbar */}
      <Navbar onBookClick={() => scrollToSection('booking')} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Cinematic Hero */}
        <Hero
          onBookClick={() => scrollToSection('booking')}
          onExploreServices={() => scrollToSection('services')}
        />

        {/* Animated Numbers / Stats Strip */}
        <StatsStrip />

        {/* Services Section */}
        <ServicesSection onSelectService={handleSelectServiceFromCard} />

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
          onBookingSuccess={handleBookingSuccess}
        />

        {/* Contact & Location Section */}
        <ContactSection />
      </main>

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
  );
}
