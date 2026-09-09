import React from 'react';
import { Gauge, Phone, Mail, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { BRAND_INFO, SERVICES_DATA } from '../data/automotiveData';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms') => void;
  onSelectService: (serviceName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onSelectService }) => {
  return (
    <footer className="relative bg-[#07080b] border-t border-white/10 text-neutral-400 pt-16 pb-12 overflow-hidden">
      {/* Top ambient highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#ff5500]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <a href="#hero" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-lg bg-[#141822] border border-white/10 flex items-center justify-center text-[#ff5500] group-hover:border-[#ff5500]/60 transition-colors">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-extrabold text-xl tracking-wider text-white">
                  TORQX
                </span>
                <span className="text-[10px] font-tech font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30 ml-2">
                  AUTOCARE
                </span>
              </div>
            </a>

            <p className="text-sm text-neutral-300 font-tech font-bold mb-3 text-[#ff5500]">
              {BRAND_INFO.tagline}
            </p>

            <p className="text-xs text-neutral-400 leading-relaxed mb-6 max-w-sm">
              Pune's premier independent automotive service center. Specializing in advanced diagnostics, precision mechanical overhauls, factory-scheduled maintenance, and detailing for European, Japanese, and luxury performance vehicles.
            </p>

            <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-white/4 border border-white/8 text-xs font-tech text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ISO 9001:2015 Certified Workshop</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-tech font-bold uppercase tracking-widest text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-tech">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">About Facility</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">Why TORQX</a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">Service Workflow</a>
              </li>
              <li>
                <a href="#our-work" className="hover:text-white transition-colors">Project Gallery</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">Client Reviews</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contact & Location</a>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-tech font-bold uppercase tracking-widest text-white mb-4">
              Specialized Services
            </h4>
            <ul className="space-y-2.5 text-xs font-tech">
              {SERVICES_DATA.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => onSelectService(s.title)}
                    className="hover:text-[#ff5500] text-left transition-colors flex items-center justify-between w-full"
                  >
                    <span>{s.title}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-600" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-tech font-bold uppercase tracking-widest text-white mb-4">
              Pune Workshop Desk
            </h4>
            
            <div className="space-y-3 text-xs font-tech">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ff5500] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-300">
                  123 Automotive Avenue, Baner-Balewadi, Pune, MH 411045
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ff5500] flex-shrink-0" />
                <a href={`tel:${BRAND_INFO.phoneRaw}`} className="text-white hover:text-[#ff5500] transition-colors font-bold">
                  {BRAND_INFO.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#ff5500] flex-shrink-0" />
                <a href={`mailto:${BRAND_INFO.email}`} className="text-neutral-300 hover:text-white transition-colors">
                  {BRAND_INFO.email}
                </a>
              </div>

              <div className="pt-2 text-[11px] text-neutral-400">
                <p>Mon - Sat: 9:00 AM – 8:00 PM</p>
                <p>Sunday: 10:00 AM – 4:00 PM</p>
              </div>
            </div>
          </div>

        </div>

        {/* Natural SEO Keywords Strip */}
        <div className="py-6 border-b border-white/6 text-[11px] font-tech text-neutral-400 flex flex-wrap items-center justify-between gap-3">
          <span className="text-neutral-400">Target Specialties:</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-400">
            <span>car service in Pune</span>
            <span>•</span>
            <span>car repair Pune</span>
            <span>•</span>
            <span>automobile service center Pune</span>
            <span>•</span>
            <span>car maintenance Pune</span>
            <span>•</span>
            <span>car detailing Pune</span>
            <span>•</span>
            <span>car diagnostics Pune</span>
            <span>•</span>
            <span>German car specialist Baner</span>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-tech">
          <div>
            © 2026 TORQX AUTOCARE. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="text-neutral-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="text-neutral-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
            >
              Terms & Conditions
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
