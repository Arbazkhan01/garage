import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/automotiveData';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section id="reviews" className="relative py-24 bg-[#0c0f16] overflow-hidden">
      {/* Glow orb */}
      <div className="absolute -top-20 left-1/4 w-80 h-80 bg-[#ff5500]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171c26] border border-white/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
              <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#ff5500]">
                AUTHENTIC OWNER TESTIMONIALS
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              TRUSTED BY DRIVERS.
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 mt-3 max-w-xl">
              From daily commuters to track-day enthusiasts across Pune, discover why vehicle owners rely on TORQX for precision engineering.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                prevSlide();
              }}
              className="w-11 h-11 rounded-xl bg-[#141923] border border-white/10 hover:border-[#ff5500] text-white flex items-center justify-center transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                nextSlide();
              }}
              className="w-11 h-11 rounded-xl bg-[#141923] border border-white/10 hover:border-[#ff5500] text-white flex items-center justify-center transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Showcase Card */}
        <div
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="relative max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl bg-gradient-to-b from-[#131722] to-[#0e1118] border border-white/12 p-8 sm:p-12 shadow-2xl relative overflow-hidden"
            >
              <Quote className="absolute top-8 right-8 w-20 h-20 text-white/4 pointer-events-none" />

              {/* Star Rating & Verified Badge */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#ff5500] text-[#ff5500]" />
                  ))}
                  <span className="text-xs font-tech font-bold text-white ml-2">5.0 / 5.0</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-tech font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Service Invoice</span>
                </div>
              </div>

              {/* Quote text */}
              <blockquote className="text-lg sm:text-2xl text-neutral-100 font-normal leading-relaxed mb-8">
                "{current.quote}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-white/8">
                <div className="flex items-center gap-4">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#ff5500]/40"
                  />
                  <div>
                    <h3 className="text-base font-display font-bold text-white">
                      {current.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-tech">
                      {current.location}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-tech uppercase font-bold text-[#ff5500] block">
                    {current.carModel}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-tech">
                    Service: {current.serviceType}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {TESTIMONIALS_DATA.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 bg-[#ff5500]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
