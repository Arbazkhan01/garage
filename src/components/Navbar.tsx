import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Menu, X, ShieldCheck, ChevronRight, Gauge, Activity, User, Shield, Wrench } from 'lucide-react';
import { BRAND_INFO } from '../data/automotiveData';
import { AuthService } from '../services/authService';

interface NavbarProps {
  onBookClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsub = AuthService.subscribe((u) => setCurrentUser(u));
    return unsub;
  }, []);

  const handleNavigation = (pathOrHash: string) => {
    setMobileMenuOpen(false);
    if (pathOrHash.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + pathOrHash);
        setTimeout(() => {
          const el = document.querySelector(pathOrHash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(pathOrHash);
        if (el) {
          const navOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
    } else {
      navigate(pathOrHash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Home', target: '#hero' },
    { label: 'Services', target: '/services' },
    { label: 'Live Tracker', target: '/service/TORQX-2026-00482' },
    { label: 'About', target: '/about' },
    { label: 'Reviews', target: '#reviews' },
    { label: 'Contact', target: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#090b0f]/95 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/60 py-3'
            : 'bg-gradient-to-b from-[#090b0f]/95 via-[#090b0f]/60 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-3 group focus:outline-none text-left"
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
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#12161f]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
            {navLinks.map((link) => {
              const isActive =
                link.target.startsWith('#')
                  ? location.pathname === '/' && location.hash === link.target
                  : location.pathname === link.target;

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavigation(link.target)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold tracking-wider transition-colors rounded-full uppercase font-tech ${
                    isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
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
                </button>
              );
            })}

            <button
              onClick={() => handleNavigation('/dashboard')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider rounded-full uppercase font-tech transition-colors ${
                location.pathname.startsWith('/dashboard')
                  ? 'bg-[#ff5500]/20 text-[#ff5500] font-bold border border-[#ff5500]/30'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              My Garage
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => handleNavigation('/admin')}
                className={`px-3 py-1.5 text-xs font-semibold tracking-wider rounded-full uppercase font-tech transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-amber-400/80 hover:text-amber-300'
                }`}
              >
                Admin Bay
              </button>
            )}
          </nav>

          {/* Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${BRAND_INFO.phoneRaw}`}
              className="hidden xl:flex items-center gap-2 text-xs font-tech text-neutral-300 hover:text-white transition-colors py-1.5 px-3 rounded-lg border border-white/5 bg-white/5"
            >
              <Phone className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>{BRAND_INFO.phoneDisplay}</span>
            </a>

            <button
              onClick={() => {
                if (onBookClick && location.pathname === '/') {
                  onBookClick();
                } else {
                  navigate('/book-service');
                }
              }}
              className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl font-tech font-bold text-xs uppercase tracking-wider text-white bg-[#ff5500] hover:bg-[#ff6a1a] transition-all duration-200 shadow-lg shadow-[#ff5500]/25 hover:shadow-[#ff5500]/40 flex items-center gap-2"
              id="nav-book-service-btn"
            >
              <span>Book a Service</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-[#141820] text-neutral-200 hover:text-white border border-white/10"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
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
            className="fixed inset-x-0 top-[65px] z-40 bg-[#090b0f]/98 backdrop-blur-xl border-b border-white/10 p-6 lg:hidden shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="flex flex-col space-y-2.5">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavigation(link.target)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-tech uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>
              ))}

              <button
                onClick={() => handleNavigation('/dashboard')}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-tech uppercase tracking-wider text-[#ff5500] hover:bg-white/5 transition-colors text-left"
              >
                <span>My Customer Garage</span>
                <ChevronRight className="w-4 h-4 text-[#ff5500]" />
              </button>

              <button
                onClick={() => handleNavigation('/admin')}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-tech uppercase tracking-wider text-amber-400 hover:bg-white/5 transition-colors text-left"
              >
                <span>Admin Operations</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>

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
                    navigate('/book-service');
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
