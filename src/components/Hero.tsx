import React from 'react';
import { motion } from 'motion/react';
import { Shield, Wrench, Cpu, CheckCircle2, ChevronDown, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { BRAND_INFO } from '../data/automotiveData';

interface HeroProps {
  onBookClick: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreServices }) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden carbon-pattern"
    >
      {/* Cinematic Background Image with dark vignette and gradient overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.08, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"
            alt="TORQX High Performance Automotive Workshop"
            className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.15]"
          />
        </motion.div>

        {/* Multi-stage dark gradient overlays for maximum contrast and luxury atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-[#0a0c10]/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ff5500]/12 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines, Trust, and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#161b24]/90 border border-white/12 backdrop-blur-md shadow-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-pulse" />
              <span className="text-xs font-tech font-bold uppercase tracking-widest text-neutral-200">
                PREMIUM AUTOMOTIVE SERVICE CENTER
              </span>
              <span className="text-[11px] font-tech text-neutral-400 pl-2 border-l border-white/10 hidden sm:inline">
                PUNE, MH
              </span>
            </motion.div>

            {/* Large Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-6xl xl:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.08] mb-6"
            >
              KEEP YOUR CAR <br />
              RUNNING AT ITS{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ff5500] via-[#ff7728] to-[#ff9955]">
                BEST.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute left-0 -bottom-1.5 w-full h-[3px] bg-[#ff5500] origin-left rounded-full"
                />
              </span>
            </motion.h1>

            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base sm:text-lg text-neutral-300 max-w-xl font-normal leading-relaxed mb-8"
            >
              Expert diagnostics, maintenance and repairs performed by skilled technicians using modern tools and genuine-quality parts.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBookClick}
                id="hero-book-service-cta"
                className="px-8 py-4 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-sm uppercase tracking-wider shadow-xl shadow-[#ff5500]/30 hover:shadow-[#ff5500]/50 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Book a Service</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreServices}
                id="hero-explore-services-cta"
                className="px-8 py-4 rounded-xl bg-[#141923]/90 hover:bg-[#1a2130] text-neutral-200 hover:text-white font-tech font-semibold text-sm uppercase tracking-wider border border-white/12 hover:border-white/25 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span>Explore Services</span>
                <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </motion.button>
            </motion.div>

            {/* Small Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-white/10 w-full"
            >
              <div className="flex items-center gap-2.5 text-xs font-tech text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-[#ff5500]/15 text-[#ff5500] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Certified Technicians</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-tech text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-[#ff5500]/15 text-[#ff5500] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Advanced Diagnostics</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-tech text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-[#ff5500]/15 text-[#ff5500] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Genuine OEM Parts</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Animated Floating Service-Booking Quick Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full max-w-md relative"
            >
              {/* Subtle ambient backglow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff5500]/30 to-amber-500/10 rounded-2xl blur-xl opacity-60 pointer-events-none" />

              {/* Floating Card Content */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative rounded-2xl bg-[#11151c]/90 border border-white/12 p-6 backdrop-blur-xl shadow-2xl shadow-black/80"
              >
                {/* Header of floating card */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-tech font-bold uppercase tracking-wider text-white">
                        Express Bay Priority
                      </h3>
                      <p className="text-[11px] text-neutral-400">Instant Online Scheduling</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-tech font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Bays Open Today
                  </span>
                </div>

                {/* Next available slot widget */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-white/4 border border-white/6">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1 font-tech">
                      <Calendar className="w-3.5 h-3.5 text-[#ff5500]" />
                      <span>Earliest Slot</span>
                    </div>
                    <div className="text-xs font-bold text-white">Today Available</div>
                    <div className="text-[10px] text-neutral-400">2:30 PM & 4:15 PM</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/4 border border-white/6">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1 font-tech">
                      <Clock className="w-3.5 h-3.5 text-[#ff5500]" />
                      <span>Inspection</span>
                    </div>
                    <div className="text-xs font-bold text-white">40-Point Check</div>
                    <div className="text-[10px] text-emerald-400 font-medium">Complimentary</div>
                  </div>
                </div>

                {/* Popular Services Quick Selector */}
                <div className="space-y-2 mb-5">
                  <span className="text-[11px] font-tech uppercase tracking-wider text-neutral-400 block">
                    Fast Lane Quick Select
                  </span>
                  
                  <button
                    onClick={onBookClick}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#181e28] hover:bg-[#1f2734] border border-white/6 hover:border-[#ff5500]/40 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wrench className="w-4 h-4 text-[#ff5500]" />
                      <div>
                        <div className="text-xs font-semibold text-neutral-200 group-hover:text-white">Full Periodic Maintenance</div>
                        <div className="text-[10px] text-neutral-400">Oil, Filters, 40-pt safety audit</div>
                      </div>
                    </div>
                    <span className="text-xs font-tech font-bold text-neutral-300 group-hover:text-[#ff5500] transition-colors">
                      From ₹3,199
                    </span>
                  </button>

                  <button
                    onClick={onBookClick}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#181e28] hover:bg-[#1f2734] border border-white/6 hover:border-[#ff5500]/40 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-[#ff5500]" />
                      <div>
                        <div className="text-xs font-semibold text-neutral-200 group-hover:text-white">Computer ECU Diagnostics</div>
                        <div className="text-[10px] text-neutral-400">Full vehicle code scan & report</div>
                      </div>
                    </div>
                    <span className="text-xs font-tech font-bold text-neutral-300 group-hover:text-[#ff5500] transition-colors">
                      From ₹1,499
                    </span>
                  </button>
                </div>

                {/* Action button inside card */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onBookClick}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7728] text-white font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ff5500]/25"
                >
                  <Shield className="w-4 h-4" />
                  <span>Schedule Service with Warranty</span>
                </motion.button>

                <p className="text-[10px] text-center text-neutral-400 mt-2.5">
                  No advance payment needed • Pay after satisfaction
                </p>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        onClick={onExploreServices}
      >
        <span className="text-[10px] font-tech uppercase tracking-widest text-neutral-400">
          Scroll to explore
        </span>
        <ChevronDown className="w-4 h-4 text-[#ff5500]" />
      </motion.div>
    </section>
  );
};
