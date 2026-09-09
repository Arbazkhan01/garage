import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Clock, CheckCircle2, ChevronRight, Filter, Search, Car, ShieldAlert } from 'lucide-react';
import { COMPREHENSIVE_SERVICES } from '../data/pricingData';
import { VEHICLE_DATABASE } from '../data/vehicleData';
import { PricingService } from '../services/pricingService';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mechanical' | 'diagnostics' | 'detailing'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Estimator vehicle state
  const [selectedBrand, setSelectedBrand] = useState('BMW');
  const [selectedModel, setSelectedModel] = useState('3 Series');

  const filteredServices = useMemo(() => {
    return COMPREHENSIVE_SERVICES.filter((s) => {
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500] px-3 py-1 rounded bg-[#ff5500]/10 border border-[#ff5500]/25">
          Precision Engineering Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
          Automotive Service Packages
        </h1>
        <p className="text-sm sm:text-base text-neutral-400">
          Factory-grade maintenance, OEM diagnostics, and master detailing calibrated specifically for your vehicle brand and powertrain.
        </p>
      </div>

      {/* Vehicle Quick Estimator Selector Bar */}
      <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff5500]/20 text-[#ff5500] flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-tech uppercase tracking-wider text-neutral-400 block">
              Calibrated Pricing Estimator
            </span>
            <h4 className="font-bold text-white text-sm">Showing Estimated Pricing For:</h4>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              const b = VEHICLE_DATABASE.find((v) => v.name === e.target.value);
              if (b && b.models.length > 0) setSelectedModel(b.models[0].name);
            }}
            className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-tech uppercase"
          >
            {VEHICLE_DATABASE.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name} ({b.category.toUpperCase()})
              </option>
            ))}
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-tech uppercase"
          >
            {VEHICLE_DATABASE.find((b) => b.name === selectedBrand)?.models.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => navigate('/book-service')}
            className="px-4 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider shadow"
          >
            Book This Car
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-[#12161f] p-1.5 rounded-xl border border-white/10 overflow-x-auto w-full sm:w-auto">
          {(['all', 'mechanical', 'diagnostics', 'detailing'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-tech uppercase tracking-wider transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#ff5500] text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service name..."
            className="w-full bg-[#12161f] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5500]"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const priceDisplay = PricingService.getServicePriceDisplay(
            service.id,
            selectedBrand,
            selectedModel
          );

          return (
            <div
              key={service.id}
              className="bg-[#12161f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#ff5500]/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-tech uppercase tracking-widest text-[#ff5500] px-2.5 py-0.5 rounded bg-white/5">
                    {service.category}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1 font-tech">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    {service.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#ff5500] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-white/5 pt-3">
                  <span className="text-[10px] font-tech uppercase tracking-wider text-neutral-500 block mb-1">
                    Key Deliverables:
                  </span>
                  {service.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-tech uppercase tracking-wider text-neutral-400 block">
                      Estimated For {selectedBrand} {selectedModel}
                    </span>
                    <span className="text-xl font-extrabold text-white font-tech">
                      {priceDisplay.display}
                    </span>
                  </div>
                  {service.isInspectionDependent && (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Post-Inspection
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate('/book-service')}
                  className="w-full py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Book This Service</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
