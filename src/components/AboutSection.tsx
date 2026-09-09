import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Cpu, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 bg-[#0c0f15] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Large workshop visual with tech overlays and scroll reveal */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            {/* Ambient backglow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#ff5500]/20 to-blue-500/10 rounded-2xl blur-xl opacity-50" />

            <div className="relative rounded-2xl overflow-hidden border border-white/12 shadow-2xl bg-neutral-900 group">
              <img
                src="https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=1200&q=85"
                alt="TORQX Precision Workshop Facility Pune"
                className="w-full h-[460px] object-cover object-center filter brightness-[0.8] contrast-[1.1] transform group-hover:scale-103 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b0f] via-transparent to-transparent opacity-80" />

              {/* Floating diagnostic tech badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute top-5 left-5 p-3 rounded-xl bg-[#0d1017]/85 backdrop-blur-md border border-white/12 flex items-center gap-3 shadow-xl"
              >
                <div className="w-9 h-9 rounded-lg bg-[#ff5500]/15 text-[#ff5500] flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-tech font-bold uppercase tracking-wider text-white">
                    OEM Diagnostic Lab
                  </div>
                  <div className="text-[10px] text-neutral-400">Zero-error telemetry scanning</div>
                </div>
              </motion.div>

              {/* Bottom statistics card overlay */}
              <div className="absolute bottom-5 inset-x-5 p-4 rounded-xl bg-[#090c12]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-tech font-bold text-white uppercase block">
                      Certified Master Facility
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Multi-brand precision standards • ISO 9001:2015
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-display font-bold text-[#ff5500]">PUNE HUBS</span>
                  <span className="block text-[10px] text-neutral-400">Baner-Balewadi</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Text and signature element */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171c26] border border-white/10 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
              <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#ff5500]">
                THE TORQX DIFFERENCE
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-[1.1] mb-6">
              BUILT AROUND <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5500] via-[#ff7c30] to-[#ff9b57]">
                YOUR DRIVE.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-5">
              Founded on the belief that automobile maintenance should match the engineering caliber of modern vehicles, 
              <strong className="text-white font-semibold"> TORQX AUTOCARE</strong> bridges the gap between impersonal, overpriced authorized dealerships and unpredictable local garages.
            </p>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
              Our Pune facility combines aerospace-grade computerized diagnostics, factory-calibrated pneumatic lifts, and certified master technicians who treat every vehicle with uncompromising precision. From German sports coupes to family SUVs, our transparent digital reports and genuine parts ensure complete integrity at every stage of maintenance.
            </p>

            {/* Core Values Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8 pt-4 border-t border-white/8">
              <div className="flex items-center gap-2 text-xs font-tech text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500]" />
                <span>Zero unsolicited upselling</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-tech text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500]" />
                <span>Live video service tracking</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-tech text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500]" />
                <span>100% Genuine OEM components</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-tech text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500]" />
                <span>6-Month service warranty</span>
              </div>
            </div>

            {/* Small Signature-Style Element */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#141822] to-transparent border-l-2 border-[#ff5500] w-full">
              <div className="font-display font-black text-lg tracking-wider text-white">
                TORQX AUTOCARE
              </div>
              <p className="text-xs font-tech italic text-[#ff5500] mt-0.5 tracking-wide">
                "Driven by precision."
              </p>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
