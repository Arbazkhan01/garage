import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Phone, ArrowUp, Calendar } from 'lucide-react';
import { BRAND_INFO } from '../data/automotiveData';

interface FloatingCTAsProps {
  onBookClick: () => void;
}

export const FloatingCTAs: React.FC<FloatingCTAsProps> = ({ onBookClick }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Floating Action Buttons Desktop & Tablet (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Scroll To Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="pointer-events-auto w-11 h-11 rounded-full bg-[#141924]/90 backdrop-blur-md border border-white/15 text-white hover:bg-[#ff5500] flex items-center justify-center shadow-2xl transition-colors"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp Direct Chat Button */}
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={BRAND_INFO.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/40 border border-emerald-400/30 transition-all"
          id="floating-whatsapp-btn"
          aria-label="Chat on WhatsApp"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-tech font-bold uppercase tracking-wider hidden sm:inline">
            WhatsApp Desk
          </span>
        </motion.a>
      </div>

      {/* Sticky Mobile Bottom Bar (visible on mobile only) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#090b0f]/95 backdrop-blur-xl border-t border-white/10 p-3 flex items-center gap-2.5 shadow-2xl">
        <a
          href={`tel:${BRAND_INFO.phoneRaw}`}
          className="w-12 h-12 rounded-xl bg-[#171d28] border border-white/10 text-[#ff5500] flex items-center justify-center flex-shrink-0"
          aria-label="Call Garage"
        >
          <Phone className="w-5 h-5" />
        </a>

        <a
          href={BRAND_INFO.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0"
          aria-label="WhatsApp Message"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBookClick}
          className="flex-1 py-3 px-4 rounded-xl bg-[#ff5500] text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/30 flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Service</span>
        </motion.button>
      </div>
    </>
  );
};
