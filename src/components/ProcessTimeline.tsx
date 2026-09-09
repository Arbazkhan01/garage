import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  ClipboardCheck, 
  Scan, 
  Wrench, 
  ShieldCheck, 
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { PROCESS_STEPS } from '../data/automotiveData';

const STEP_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Calendar,
  ClipboardCheck,
  Scan,
  Wrench,
  ShieldCheck,
  KeyRound
};

export const ProcessTimeline: React.FC = () => {
  return (
    <section id="process" className="relative py-24 bg-[#0a0c10] border-t border-white/5 overflow-hidden">
      {/* Background grid accent */}
      <div className="absolute inset-0 carbon-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b24] border border-white/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
            <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#ff5500]">
              PRECISION WORKFLOW PROTOCOL
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            How We Service Your Car
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
            From the moment you reserve a slot to the final torque verification, experience an orchestrated process designed for transparency and peak performance.
          </p>
        </div>

        {/* Timeline Desktop & Tablet Grid with Animated Connectors */}
        <div className="relative">
          
          {/* Desktop Connecting Line behind steps */}
          <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-white/5 via-[#ff5500]/40 to-white/5 -translate-y-8 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {PROCESS_STEPS.map((step, index) => {
              const IconComp = STEP_ICONS[step.iconName] || Wrench;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative flex flex-col items-center text-center p-5 rounded-2xl bg-[#11151d] border border-white/8 hover:border-[#ff5500]/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/50"
                >
                  {/* Step Number Top Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-[#181f2b] border border-white/10 flex items-center justify-center text-white mb-4 relative group-hover:border-[#ff5500] transition-colors shadow-inner">
                    <IconComp className="w-5 h-5 text-[#ff5500] group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded bg-[#ff5500] text-black font-tech font-black text-[10px] tracking-tight">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-sm font-display font-bold text-white tracking-wide mb-2 group-hover:text-[#ff5500] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                    {step.description}
                  </p>

                  <div className="mt-auto w-full pt-2.5 border-t border-white/5 text-[10px] font-tech text-neutral-400">
                    <span className="text-[#ff5500] block mb-0.5 font-semibold">Verification</span>
                    {step.details}
                  </div>

                  {/* Step connector arrow for mobile/md */}
                  {index < PROCESS_STEPS.length - 1 && (
                    <div className="hidden md:block lg:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 text-[#ff5500]">
                      <ArrowRight className="w-4 h-4 transform rotate-90" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
