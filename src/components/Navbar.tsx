import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Menu, X, ShieldCheck, ChevronRight, Gauge } from 'lucide-react';
import { BRAND_INFO } from '../data/automotiveData';

interface NavbarProps {
  onBookClick: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Process', href: '#process' },
  { label: 'Our Work', href: '#our-work' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scrollspy logic
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const navOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#090b0f]/90 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/60 py-3.5'
            : 'bg-gradient-to-b from-[#090b0f]/90 via-[#090b0f]/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-3 group focus:outline-none"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1c222c] to-[#0c0e13] border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-[#ff5500]/60 transition-colors shadow-lg shadow-black/40">
              <div className="absolute inset-0 bg-[#ff5500]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Gauge className="w-5 h-5 text-[#ff5500] transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-wider text-white">
                  TORQX
                </span>
                <span className="text-[10px] font-tech font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30">
                  AUTO
                </span>
              </div>
              <span className="text-[10px] uppercase font-tech tracking-[0.2em] text-neutral-400 -mt-1 group-hover:text-neutral-200 transition-colors">
                AUTOCARE • PUNE
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#12161f]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/8 shadow-inner">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold tracking-wider transition-colors rounded-full uppercase font-tech ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/15"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`tel:${BRAND_INFO.phoneRaw}`}
              className="hidden xl:flex items-center gap-2 text-xs font-tech text-neutral-300 hover:text-white transition-colors py-1.5 px-3 rounded-lg border border-white/5 bg-white/5"
            >
              <Phone className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>{BRAND_INFO.phoneDisplay}</span>
            </a>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBookClick}
              className="relative group overflow-hidden px-5 py-2.5 rounded-lg font-tech font-bold text-xs uppercase tracking-wider text-white bg-[#ff5500] hover:bg-[#ff6a1a] transition-all duration-200 shadow-lg shadow-[#ff5500]/25 hover:shadow-[#ff5500]/40 flex items-center gap-2"
              id="nav-book-service-btn"
            >
              <span>Book a Service</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-[#141820] text-neutral-200 hover:text-white border border-white/10"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[68px] z-40 bg-[#090b0f]/98 backdrop-blur-xl border-b border-white/10 p-6 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-tech uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </a>
              ))}

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <a
                  href={`tel:${BRAND_INFO.phoneRaw}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#141820] text-white border border-white/10 font-tech text-xs tracking-wider"
                >
                  <Phone className="w-4 h-4 text-[#ff5500]" />
                  <span>Call: {BRAND_INFO.phoneDisplay}</span>
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onBookClick();
                  }}
                  className="w-full py-3.5 px-4 rounded-lg bg-[#ff5500] text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/30 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Schedule Service Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
