import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Car, 
  User, 
  Phone, 
  Wrench, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { POPULAR_VEHICLE_BRANDS, SERVICES_DATA, BRAND_INFO } from '../data/automotiveData';
import { BookingFormData } from '../types';

interface BookingSectionProps {
  preselectedService?: string;
  onBookingSuccess: (bookingId: string) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ 
  preselectedService,
  onBookingSuccess 
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phone: '',
    vehicleBrand: 'BMW',
    vehicleModel: '',
    serviceRequired: preselectedService || 'Periodic Service',
    preferredDate: '',
    preferredTime: '10:00 AM - 12:00 PM',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{ id: string; data: BookingFormData } | null>(null);

  // Sync preselectedService prop
  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, serviceRequired: preselectedService }));
    }
  }, [preselectedService]);

  // Set default minimum date to tomorrow
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const validate = () => {
    const errs: Partial<Record<keyof BookingFormData, string>> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full name (at least 3 letters).';
    }
    const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit phone number.';
    }
    if (!formData.vehicleBrand) {
      errs.vehicleBrand = 'Select your vehicle brand.';
    }
    if (!formData.vehicleModel.trim()) {
      errs.vehicleModel = 'Please specify your model (e.g. 320d, C-Class, Octavia).';
    }
    if (!formData.preferredDate) {
      errs.preferredDate = 'Please select a preferred service date.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedBooking({
        id: generatedId,
        data: { ...formData }
      });
      onBookingSuccess(generatedId);
    }, 900);
  };

  const timeSlots = [
    '09:00 AM - 11:00 AM (Morning)',
    '11:30 AM - 01:30 PM (Midday)',
    '02:30 PM - 04:30 PM (Afternoon)',
    '05:00 PM - 07:00 PM (Evening)'
  ];

  return (
    <section id="booking" className="relative py-24 bg-[#0a0c10] border-t border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#ff5500]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161a24] border border-white/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
            <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#ff5500]">
              PRIORITY BAY ALLOCATION
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            Book Your Service
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 mt-3">
            Schedule direct with our certified technicians. Transparent estimates, genuine parts, and zero guesswork.
          </p>
        </div>

        {/* Booking Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Booking Form Column */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl bg-[#11151e] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {confirmedBooking ? (
                  /* Success State */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-xl">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-tech text-[#ff5500] font-bold uppercase mb-2">
                      Booking Confirmed • Token #{confirmedBooking.id}
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-3">
                      Your Service Slot is Reserved!
                    </h3>

                    <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed mb-8">
                      Thank you, <strong className="text-white">{confirmedBooking.data.fullName}</strong>. Our service advisor has logged your{' '}
                      <strong className="text-white">{confirmedBooking.data.vehicleBrand} {confirmedBooking.data.vehicleModel}</strong> for{' '}
                      <strong className="text-[#ff5500]">{confirmedBooking.data.serviceRequired}</strong> on{' '}
                      <strong className="text-white">{confirmedBooking.data.preferredDate}</strong> ({confirmedBooking.data.preferredTime}).
                    </p>

                    {/* Booking summary box */}
                    <div className="p-5 rounded-2xl bg-white/3 border border-white/8 text-left max-w-lg mx-auto mb-8 space-y-2 text-xs font-tech">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-neutral-400">Customer Phone:</span>
                        <span className="text-white font-semibold">{confirmedBooking.data.phone}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-neutral-400">Service Center:</span>
                        <span className="text-white font-semibold">TORQX AutoCare Baner-Balewadi, Pune</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-neutral-400">Complimentary Add-on:</span>
                        <span className="text-emerald-400 font-semibold">40-Point Digital Safety Audit Included</span>
                      </div>
                      {confirmedBooking.data.additionalNotes && (
                        <div className="py-1">
                          <span className="text-neutral-400 block mb-0.5">Notes:</span>
                          <span className="text-neutral-300 italic">{confirmedBooking.data.additionalNotes}</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <a
                        href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=Hello%20TORQX%2C%20I%20just%20booked%20service%20token%20${confirmedBooking.id}%20for%20my%20${encodeURIComponent(confirmedBooking.data.vehicleBrand + ' ' + confirmedBooking.data.vehicleModel)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                      >
                        <span>Connect on WhatsApp</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => {
                          setConfirmedBooking(null);
                          setFormData({
                            fullName: '',
                            phone: '',
                            vehicleBrand: 'BMW',
                            vehicleModel: '',
                            serviceRequired: 'Periodic Service',
                            preferredDate: '',
                            preferredTime: '10:00 AM - 12:00 PM',
                            additionalNotes: ''
                          });
                        }}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-tech text-xs uppercase tracking-wider border border-white/10 transition-colors"
                      >
                        Schedule Another Vehicle
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Form State */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Customer Info row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-tech font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#ff5500]" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData({ ...formData, fullName: e.target.value });
                            if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                          }}
                          placeholder="e.g. Vikram Malhotra"
                          className={`w-full px-4 py-3 rounded-xl bg-[#171d28] border ${
                            errors.fullName ? 'border-red-500/80 focus:ring-red-500' : 'border-white/10 focus:border-[#ff5500]'
                          } text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#ff5500] transition-colors`}
                        />
                        {errors.fullName && (
                          <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-tech font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#ff5500]" />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: undefined });
                          }}
                          placeholder="+91 98765 43210"
                          className={`w-full px-4 py-3 rounded-xl bg-[#171d28] border ${
                            errors.phone ? 'border-red-500/80 focus:ring-red-500' : 'border-white/10 focus:border-[#ff5500]'
                          } text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#ff5500] transition-colors`}
                        />
                        {errors.phone && (
                          <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Info row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-tech font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-[#ff5500]" />
                          Vehicle Brand *
                        </label>
                        <select
                          value={formData.vehicleBrand}
                          onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#171d28] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] transition-colors"
                        >
                          {POPULAR_VEHICLE_BRANDS.map(brand => (
                            <option key={brand} value={brand} className="bg-[#171d28] text-white">
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-tech font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-[#ff5500]" />
                          Vehicle Model & Year *
                        </label>
                        <input
                          type="text"
                          value={formData.vehicleModel}
                          onChange={(e) => {
                            setFormData({ ...formData, vehicleModel: e.target.value });
                            if (errors.vehicleModel) setErrors({ ...errors, vehicleModel: undefined });
                          }}
                          placeholder="e.g. 530d M Sport (2021)"
                          className={`w-full px-4 py-3 rounded-xl bg-[#171d28] border ${
                            errors.vehicleModel ? 'border-red-500/80 focus:ring-red-500' : 'border-white/10 focus:border-[#ff5500]'
                          } text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#ff5500] transition-colors`}
                        />
                        {errors.vehicleModel && (
                          <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.vehicleModel}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Service Required */}
                    <div>
                      <label className="block text-xs font-tech font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-[#ff5500]" />
                        Service Required *
                      </label>
                      <select
                        value={formData.serviceRequired}
                        onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#171d28] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] transition-colors"
                      >
                        {SERVICES_DATA.map(s => (
                          <option key={s.id} value={s.title} className="bg-[#171d28] text-white">
                            {s.title} ({s.priceEstimate})
                          </option>
                        ))}
                        <option value="General Inspection & Consultation" className="bg-[#171d28] text-white">
                          General Inspection & Consultation
                        </option>
                        <option value="Running Noise / Suspension Diagnosis" className="bg-[#171d28] text-white">
                          Running Noise / Suspension Diagnosis
                        </option>
                      </select>
                    </div>

                    {/* Preferred Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-tech font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#ff5500]" />
                          Preferred Date *
                        </label>
                        <input
                          type="date"
                          min={tomorrowStr}
                          value={formData.preferredDate}
                          onChange={(e) => {
                            setFormData({ ...formData, preferredDate: e.target.value });
                            if (errors.preferredDate) setErrors({ ...errors, preferredDate: undefined });
                          }}
                          className={`w-full px-4 py-3 rounded-xl bg-[#171d28] border ${
                            errors.preferredDate ? 'border-red-500/80 focus:ring-red-500' : 'border-white/10 focus:border-[#ff5500]'
                          } text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ff5500] transition-colors`}
                        />
                        {errors.preferredDate && (
                          <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.preferredDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-tech font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#ff5500]" />
                          Preferred Time *
                        </label>
                        <select
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#171d28] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] transition-colors"
                        >
                          {timeSlots.map(slot => (
                            <option key={slot} value={slot} className="bg-[#171d28] text-white">
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-xs font-tech font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#ff5500]" />
                        Additional Notes / Symptoms (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                        placeholder="Mention any warning lights, rattling sounds, specific oil brand preferences, or pick-up address..."
                        className="w-full px-4 py-3 rounded-xl bg-[#171d28] border border-white/10 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] transition-colors resize-none"
                      />
                    </div>

                    {/* Submit CTA */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isSubmitting}
                      type="submit"
                      id="submit-booking-btn"
                      className="w-full py-4 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-sm uppercase tracking-wider shadow-xl shadow-[#ff5500]/30 hover:shadow-[#ff5500]/40 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Reserving Service Bay...</span>
                        </div>
                      ) : (
                        <>
                          <span>Schedule My Service</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-[11px] text-center text-neutral-400">
                      No upfront payment required. You will receive an instant appointment token and service intake confirmation.
                    </p>
                  </form>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Side Panel: Why book with us? */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl bg-[#131722] border border-white/10 p-6 sm:p-8 shadow-xl relative">
              
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/8">
                <div className="w-8 h-8 rounded-lg bg-[#ff5500]/15 text-[#ff5500] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-white">
                  Why book with us?
                </h3>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-tech font-bold uppercase tracking-wider text-white">
                      Transparent Pricing
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Zero surprise line-items. Itemized quotation shared and approved before tools touch your vehicle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-tech font-bold uppercase tracking-wider text-white">
                      Experienced Technicians
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Factory-certified master mechanics with decade-plus specialized experience across German & premium cars.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-tech font-bold uppercase tracking-wider text-white">
                      Genuine Parts
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      100% authentic OEM components with verifiable QR packaging and manufacturer warranty intact.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-tech font-bold uppercase tracking-wider text-white">
                      Digital Inspection Report
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Live photo and video updates sent straight to your phone so you see every component replaced.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-tech font-bold uppercase tracking-wider text-white">
                      Service Warranty
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Unconditional 6-month or 10,000 km workshop warranty on all scheduled repairs and labor.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct helpline box inside side panel */}
              <div className="mt-8 pt-6 border-t border-white/8">
                <span className="text-[11px] font-tech uppercase tracking-wider text-neutral-400 block mb-2">
                  Need Urgent Advice or Towing?
                </span>
                <a
                  href={`tel:${BRAND_INFO.phoneRaw}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-tech text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#ff5500]" />
                  <span>Call Master Advisor: {BRAND_INFO.phoneDisplay}</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
