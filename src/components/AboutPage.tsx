import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Wrench, Award, Users, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500] px-3 py-1 rounded bg-[#ff5500]/10 border border-[#ff5500]/25">
          Engineering Heritage & Standards
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
          Precision Automotive Care. Zero Compromises.
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
          Founded by motorsport mechanics and aerospace diagnostic technicians, TORQX AUTOCARE was established to bridge the gap between expensive dealership bureaucracy and inconsistent local workshops.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: ShieldCheck,
            title: '100% Genuine OEM Parts',
            desc: 'Direct sourcing partnerships with Bosch, Motul, Brembo, and genuine OEM manufacturers with QR verifiable serials.'
          },
          {
            icon: Wrench,
            title: 'Dealer-Level Diagnostics',
            desc: 'OEM diagnostic platforms including ISTA (BMW), ODIS (Audi/VW), Xentry (Mercedes), and Hunter Hawkeye Elite 3D alignment.'
          },
          {
            icon: Award,
            title: '12-Month / 15,000 KM Warranty',
            desc: 'Comprehensive written warranty on all major mechanical repairs, sensor replacements, and structural overhauls.'
          },
          {
            icon: Activity,
            title: '60-Point Digital Transparency',
            desc: 'Every car receives a digital telemetry audit with HD inspection photos and bore-scope videos before a single bolt is turned.'
          }
        ].map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div key={i} className="bg-[#12161f] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#ff5500]/15 text-[#ff5500] flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">{pillar.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{pillar.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Baner Facility Specs */}
      <div className="bg-[#12161f] border border-white/10 rounded-2xl p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500]">
              Facility Blueprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              State-of-the-Art Baner Technology Center
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Our 18,000 sq. ft. purpose-built facility in Baner, Pune features 6 hydraulic lift bays, a climate-controlled dust-free paint booth, cleanroom diagnostics hub, and a premium customer lounge with high-speed Wi-Fi and live workshop bay monitors.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              {[
                '6 Hydraulic Service Lifts',
                'Hunter 3D Wheel Aligner',
                'Dual-Climate Detailing Bay',
                'OBD-II Cloud Telemetry',
                'Chauffeur Valet Fleet',
                '24/7 Roadside Assistance'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/book-service')}
                className="px-6 py-3 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/25 transition-all"
              >
                Schedule Facility Visit
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80"
              alt="TORQX Facility Workshop"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b0f] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs">
              <span className="font-bold text-white block">Bay 01 - Diagnostic Bay & Cleanroom</span>
              <span className="text-neutral-400 text-[11px]">Equipped with high-voltage hybrid isolators and digital telemetry analyzers.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
