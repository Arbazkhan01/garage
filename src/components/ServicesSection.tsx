import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  CalendarCheck, 
  Disc, 
  Wind, 
  Gauge, 
  Cpu, 
  Zap, 
  Sparkles, 
  ArrowUpRight, 
  Check, 
  Clock, 
  Tag
} from 'lucide-react';
import { SERVICES_DATA } from '../data/automotiveData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Wrench,
  CalendarCheck,
  Disc,
  Wind,
  Gauge,
  Cpu,
  Zap,
  Sparkles
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mechanical' | 'diagnostics' | 'detailing'>('all');
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<ServiceItem | null>(null);

  const filteredServices = SERVICES_DATA.filter((service) => {
    if (activeTab === 'all') return true;
    return service.category === activeTab;
  });

  return (
    <section id="services" className="relative py-24 bg-[#0a0c10] overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#ff5500]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171c26] border border-white/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
              <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#ff5500]">
                MASTER WORKSHOP CAPABILITIES
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              Everything Your Car Needs.
            </h2>
            
            <p className="text-sm sm:text-base text-neutral-400 mt-3 max-w-2xl">
              From routine maintenance to advanced diagnostics, we've got your vehicle covered with dealer-grade equipment and master mechanics.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6 md:mt-0 bg-[#12161f] p-1.5 rounded-xl border border-white/8">
            {(
              [
                { id: 'all', label: 'All Services' },
                { id: 'mechanical', label: 'Mechanical' },
                { id: 'diagnostics', label: 'Diagnostics' },
                { id: 'detailing', label: 'Detailing' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#ff5500] text-white shadow-md shadow-[#ff5500]/25'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service, index) => {
            const IconComp = ICON_MAP[service.iconName] || Wrench;

            return (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl bg-gradient-to-b from-[#141820] to-[#0e1117] border border-white/8 hover:border-[#ff5500]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl shadow-black/40 hover:shadow-[#ff5500]/10"
              >
                {/* Image header with dark overlay */}
                <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.1] transform group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141820] via-[#141820]/50 to-transparent" />

                  {/* Icon badge floating over image */}
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-[#0e1117]/85 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#ff5500] group-hover:bg-[#ff5500] group-hover:text-white group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <IconComp className="w-5 h-5 transition-transform duration-300" />
                  </div>

                  {/* Price Tag badge */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-tech font-bold text-white">
                    {service.priceEstimate}
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white tracking-wide group-hover:text-[#ff5500] transition-colors flex items-center justify-between">
                      <span>{service.title}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 text-[#ff5500] transition-all" />
                    </h3>

                    <p className="text-xs text-neutral-300 mt-2 line-clamp-2 leading-relaxed">
                      {service.shortDesc}
                    </p>

                    {/* Quick feature checklist revealed on hover or persistent */}
                    <ul className="mt-4 space-y-1.5 pt-3 border-t border-white/6 text-[11px] font-tech text-neutral-400">
                      {service.features.slice(0, 2).map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3 h-3 text-[#ff5500] flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-4 mt-4 border-t border-white/6 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedServiceDetail(service)}
                      className="text-xs font-tech text-neutral-400 hover:text-white underline decoration-white/20 underline-offset-4 transition-colors"
                    >
                      View Specs
                    </button>

                    <button
                      onClick={() => onSelectService(service.title)}
                      className="px-3 py-1.5 rounded-lg bg-[#1e2430] group-hover:bg-[#ff5500] text-neutral-200 group-hover:text-white text-xs font-tech font-bold tracking-wider uppercase transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal for Service Deep Specs */}
        <AnimatePresence>
          {selectedServiceDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedServiceDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-[#12161f] border border-white/15 rounded-2xl overflow-hidden shadow-2xl relative"
              >
                <div className="relative h-48 w-full">
                  <img
                    src={selectedServiceDetail.image}
                    alt={selectedServiceDetail.title}
                    className="w-full h-full object-cover filter brightness-[0.7]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-transparent to-transparent" />
                  <button
                    onClick={() => setSelectedServiceDetail(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 border border-white/20"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-display font-extrabold text-white">
                        {selectedServiceDetail.title}
                      </h3>
                      <p className="text-xs font-tech text-[#ff5500] uppercase tracking-wider mt-1">
                        Professional Automotive Service Category: {selectedServiceDetail.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs font-tech text-neutral-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-[#ff5500]" />
                        {selectedServiceDetail.duration}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-tech text-[#ff5500] font-bold bg-[#ff5500]/10 px-2.5 py-1 rounded-md border border-[#ff5500]/25">
                        <Tag className="w-3.5 h-3.5" />
                        {selectedServiceDetail.priceEstimate}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {selectedServiceDetail.detailedDesc}
                  </p>

                  <h4 className="text-xs font-tech font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    Service Scope & Protocols Included:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                    {selectedServiceDetail.features.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-white/3 border border-white/6 text-xs text-neutral-200">
                        <Check className="w-4 h-4 text-[#ff5500] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setSelectedServiceDetail(null)}
                      className="px-4 py-2 rounded-lg text-xs font-tech uppercase text-neutral-400 hover:text-white"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const name = selectedServiceDetail.title;
                        setSelectedServiceDetail(null);
                        onSelectService(name);
                      }}
                      className="px-6 py-2.5 rounded-lg bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-tech font-bold uppercase tracking-wider shadow-lg shadow-[#ff5500]/30"
                    >
                      Schedule This Service
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
