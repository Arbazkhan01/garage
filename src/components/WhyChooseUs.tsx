import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Award, 
  Cpu, 
  Shield, 
  Smartphone, 
  CheckCircle2 
} from 'lucide-react';
import { WHY_CHOOSE_US_ITEMS } from '../data/automotiveData';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  FileText,
  Award,
  Cpu,
  Shield,
  Smartphone,
  CheckCircle2
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-us" className="relative py-24 bg-[#090b0f] overflow-hidden">
      {/* Radial lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff5500]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161a24] border border-white/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
            <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#ff5500]">
              UNCOMPROMISING SERVICE STANDARDS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            WHY DRIVERS CHOOSE TORQX
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
            Engineered from the ground up to replace dealership friction with complete clarity, technical excellence, and guaranteed peace of mind.
          </p>
        </div>

        {/* 6 Features Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US_ITEMS.map((item, index) => {
            const IconComp = ICON_MAP[item.iconName] || Shield;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl bg-gradient-to-b from-[#131720] to-[#0d1016] border border-white/8 hover:border-[#ff5500]/40 p-7 transition-all duration-300 shadow-xl shadow-black/40 flex flex-col justify-between"
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff5500]/5 rounded-bl-full group-hover:bg-[#ff5500]/10 transition-colors pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#1a202c] border border-white/10 flex items-center justify-center text-[#ff5500] group-hover:bg-[#ff5500] group-hover:text-white transition-all duration-300 shadow-md">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-tech font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/4 border border-white/8 text-neutral-300 group-hover:text-[#ff5500] transition-colors">
                      {item.stat}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-white tracking-wide group-hover:text-[#ff5500] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-tech text-neutral-400">
                  <span className="text-[#ff5500] font-semibold">Standard Protocol</span>
                  <span>100% Guaranteed</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
