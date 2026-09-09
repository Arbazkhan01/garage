import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Phone, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { BRAND_INFO } from '../data/automotiveData';

interface SpecialOfferProps {
  onBookClick: () => void;
}

export const SpecialOffer: React.FC<SpecialOfferProps> = ({ onBookClick }) => {
  return (
    <section className="relative py-20 bg-[#090b0f] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-r from-[#121622] via-[#0f121a] to-[#161a26] shadow-2xl p-8 sm:p-14">
          
          {/* Background automotive visual with dark gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
              alt="Porsche Performance Car in Garage"
              className="w-full h-full object-cover object-right filter brightness-[0.35] contrast-[1.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090b0f] via-[#090b0f]/85 to-transparent" />
            
            {/* Animated accent lighting */}
            <motion.div
              animate={{ opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-24 -left-24 w-96 h-96 bg-[#ff5500] rounded-full blur-[100px] pointer-events-none"
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5500]/15 border border-[#ff5500]/30 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
              <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500]">
                LIMITED SERVICE APPOINTMENT WINDOW
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-[1.1] mb-5">
              READY FOR YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5500] via-[#ff7c30] to-[#ff9b57]">
                NEXT SERVICE?
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8 max-w-xl">
              Book your next service today and keep your vehicle performing at its best. Includes our complimentary 40-point digital OBD health audit and full fluid safety inspection.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBookClick}
                className="px-8 py-4 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-sm uppercase tracking-wider shadow-xl shadow-[#ff5500]/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Book a Service</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <a
                href={`tel:${BRAND_INFO.phoneRaw}`}
                className="px-8 py-4 rounded-xl bg-[#1a202c]/90 hover:bg-[#232b3b] text-neutral-200 hover:text-white font-tech font-semibold text-sm uppercase tracking-wider border border-white/12 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <Phone className="w-4 h-4 text-[#ff5500]" />
                <span>Call Us Direct</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-tech text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff5500]" />
                <span>Same-day turnaround for periodic maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero advance deposit needed</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
