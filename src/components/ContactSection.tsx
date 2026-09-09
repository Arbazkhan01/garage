import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Navigation, 
  ExternalLink,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { BRAND_INFO } from '../data/automotiveData';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="relative py-24 bg-[#090c12] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161a24] border border-white/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
            <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#ff5500]">
              VISIT OUR PUNE WORKSHOP
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            Connect With TORQX.
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 mt-3">
            Located conveniently along the Baner-Balewadi automotive hub in Pune. Drive in or contact our service desk for immediate technical assistance.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Details Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Primary Details Card */}
            <div className="rounded-3xl bg-[#11151f] border border-white/10 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/8">
                <div className="w-10 h-10 rounded-xl bg-[#ff5500]/15 text-[#ff5500] flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white tracking-wide">
                    TORQX AUTOCARE
                  </h3>
                  <span className="text-[11px] font-tech text-[#ff5500] uppercase tracking-wider">
                    Flagship Service Bay
                  </span>
                </div>
              </div>

              <div className="space-y-5 text-xs sm:text-sm font-tech">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#ff5500] flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Address</span>
                    <p className="text-white mt-0.5 leading-relaxed font-sans text-xs sm:text-sm">
                      123 Automotive Avenue, Baner-Balewadi Tech Corridor, Pune, Maharashtra 411045, India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#ff5500] flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Phone</span>
                    <a
                      href={`tel:${BRAND_INFO.phoneRaw}`}
                      className="text-white hover:text-[#ff5500] transition-colors mt-0.5 block font-bold text-sm"
                    >
                      {BRAND_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#ff5500] flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Email</span>
                    <a
                      href={`mailto:${BRAND_INFO.email}`}
                      className="text-white hover:text-[#ff5500] transition-colors mt-0.5 block"
                    >
                      {BRAND_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-3 pt-2 border-t border-white/6">
                  <Clock className="w-4 h-4 text-[#ff5500] flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Operating Hours</span>
                    <p className="text-white mt-0.5">
                      Monday – Saturday: <strong className="text-[#ff5500]">9:00 AM – 8:00 PM</strong>
                    </p>
                    <p className="text-neutral-300">
                      Sunday: <strong>10:00 AM – 4:00 PM</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-6 border-t border-white/8">
                <a
                  href={`tel:${BRAND_INFO.phoneRaw}`}
                  className="py-3 px-4 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ff5500]/25 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>

                <a
                  href={BRAND_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quick Roadside Assistance badge */}
            <div className="p-4 rounded-2xl bg-[#141924] border border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-tech font-bold text-white uppercase block">
                    Pune Breakdown Support
                  </span>
                  <span className="text-[11px] text-neutral-400">Flatbed towing & on-site battery jumpstart</span>
                </div>
              </div>
              <a
                href={`tel:${BRAND_INFO.phoneRaw}`}
                className="text-xs font-tech text-[#ff5500] font-bold hover:underline"
              >
                24/7 Helpline
              </a>
            </div>

          </div>

          {/* Right: Google Maps-Style Stylized Dark Location Panel */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[440px] rounded-3xl overflow-hidden border border-white/12 bg-[#121620] relative flex flex-col justify-between shadow-2xl">
              
              {/* Simulated stylized dark automotive map background */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1400&q=80"
                  alt="City Map Aerial Night View"
                  className="w-full h-full object-cover filter brightness-[0.25] contrast-[1.4] saturate-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-[#0d1017]/40 to-transparent" />
                <div className="absolute inset-0 carbon-pattern opacity-60 pointer-events-none" />

                {/* Map Grid Road Lines Graphic */}
                <svg className="absolute inset-0 w-full h-full opacity-30 stroke-white/20" xmlns="http://www.w3.org/2000/svg">
                  <line x1="10%" y1="0" x2="30%" y2="100%" strokeWidth="3" stroke="#ff5500" strokeOpacity="0.4" />
                  <line x1="0" y1="40%" x2="100%" y2="50%" strokeWidth="2" strokeDasharray="6,6" />
                  <line x1="70%" y1="0" x2="60%" y2="100%" strokeWidth="2" />
                  <circle cx="50%" cy="46%" r="70" fill="none" stroke="#ff5500" strokeWidth="1" strokeDasharray="4,4" className="animate-spin origin-center" style={{ transformOrigin: '50% 46%' }} />
                </svg>
              </div>

              {/* Pin Center Marker */}
              <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                {/* Pin Pulse */}
                <div className="w-14 h-14 rounded-full bg-[#ff5500]/20 animate-ping absolute -top-1" />
                
                {/* Pin Head */}
                <div className="relative px-3.5 py-1.5 rounded-xl bg-[#ff5500] text-white font-tech font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>TORQX CENTER</span>
                </div>
                {/* Pin Stem */}
                <div className="w-0.5 h-6 bg-[#ff5500]" />
                <div className="w-3 h-1.5 rounded-full bg-black/80 blur-xs" />
              </div>

              {/* Map Top Status Bar */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs font-tech text-neutral-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Facility Traffic: Normal / Low Waiting</span>
                </div>

                <a
                  href="https://maps.google.com/?q=Pune+Automotive+Avenue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs font-tech text-white hover:text-[#ff5500] flex items-center gap-1.5 transition-colors"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Bottom Card with Get Directions CTA */}
              <div className="relative z-10 p-6 sm:p-8 bg-gradient-to-t from-[#0d1017] via-[#0d1017]/95 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#141822]/90 border border-white/10 backdrop-blur-md">
                  <div>
                    <h4 className="text-sm font-display font-bold text-white">
                      123 Automotive Avenue, Pune
                    </h4>
                    <p className="text-xs text-neutral-400 font-tech mt-0.5">
                      1.5 km from Mumbai-Pune Expressway exit • Dedicated customer parking
                    </p>
                  </div>

                  <a
                    href="https://maps.google.com/?q=Pune+Automotive+Avenue"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 flex-shrink-0 shadow-lg transition-all"
                  >
                    <Navigation className="w-4 h-4 text-[#ff5500]" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
