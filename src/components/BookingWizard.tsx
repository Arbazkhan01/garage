import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Car,
  Wrench,
  PlusCircle,
  Calendar,
  User,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Tag,
  ShieldAlert,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  FileText,
  Share2,
  CalendarPlus,
  AlertCircle
} from 'lucide-react';
import { VehicleBrand, ServiceItem, FuelType, AddonOption } from '../types';
import { VEHICLE_DATABASE } from '../data/vehicleData';
import { COMPREHENSIVE_SERVICES, ADDON_OPTIONS } from '../data/pricingData';
import { PricingService } from '../services/pricingService';
import { BookingService } from '../services/bookingService';
import { AuthService } from '../services/authService';
import { BRAND_INFO } from '../data/automotiveData';

interface BookingWizardProps {
  initialServiceId?: string;
  onClose?: () => void;
}

const TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:30 AM - 01:30 PM',
  '02:30 PM - 04:30 PM',
  '05:00 PM - 07:00 PM'
];

export const BookingWizard: React.FC<BookingWizardProps> = ({ initialServiceId, onClose }) => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  // Wizard Step (1 to 6, then 7 for confirmation)
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedBrand, setSelectedBrand] = useState<string>('BMW');
  const [selectedModel, setSelectedModel] = useState<string>('3 Series');
  const [selectedVariant, setSelectedVariant] = useState<string>('330i Gran Limousine M Sport (258hp)');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [regNumber, setRegNumber] = useState<string>('MH 12 TC 8899');

  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || 'periodic-service');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<'all' | 'mechanical' | 'diagnostics' | 'detailing'>('all');

  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(['oil-upgrade', 'ac-disinfecting']);

  // Next 14 dates for appointment
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        iso: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.iso || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [pickupDrop, setPickupDrop] = useState<'garage_drop' | 'pickup_only' | 'pickup_and_drop'>('garage_drop');
  const [pickupAddress, setPickupAddress] = useState<string>(currentUser.address || 'Kalyani Nagar, Pune, MH');

  // Customer Details
  const [customerName, setCustomerName] = useState<string>(currentUser.name || 'Vikram Malhotra');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser.phone || '+91 98221 44556');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser.email || 'vikram.malhotra@gmail.com');
  const [additionalNotes, setAdditionalNotes] = useState<string>('Please inspect brake pads and steering alignment.');

  // Coupon state
  const [couponInput, setCouponInput] = useState<string>('TORQX10');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('TORQX10');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Confirmed booking state
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Derived lists for Vehicle step
  const currentBrandObj: VehicleBrand | undefined = useMemo(() => {
    return VEHICLE_DATABASE.find((b) => b.name === selectedBrand) || VEHICLE_DATABASE[0];
  }, [selectedBrand]);

  const currentModels = useMemo(() => {
    return currentBrandObj?.models || [];
  }, [currentBrandObj]);

  const currentModelObj = useMemo(() => {
    return currentModels.find((m) => m.name === selectedModel) || currentModels[0];
  }, [currentModels, selectedModel]);

  const currentVariants = useMemo(() => {
    return currentModelObj?.variants || [];
  }, [currentModelObj]);

  // Handle Brand selection
  const handleBrandChange = (brandName: string) => {
    setSelectedBrand(brandName);
    const b = VEHICLE_DATABASE.find((brand) => brand.name === brandName);
    if (b && b.models.length > 0) {
      const firstModel = b.models[0];
      setSelectedModel(firstModel.name);
      if (firstModel.variants.length > 0) {
        setSelectedVariant(firstModel.variants[0].name);
        if (firstModel.variants[0].fuelTypes.length > 0) {
          setFuelType(firstModel.variants[0].fuelTypes[0]);
        }
      }
    }
  };

  // Handle Model selection
  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    const m = currentModels.find((model) => model.name === modelName);
    if (m && m.variants.length > 0) {
      setSelectedVariant(m.variants[0].name);
      if (m.variants[0].fuelTypes.length > 0) {
        setFuelType(m.variants[0].fuelTypes[0]);
      }
    }
  };

  // Toggle Addon
  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Live Price Calculation
  const priceBreakdown = useMemo(() => {
    return PricingService.calculatePricing({
      brandName: selectedBrand,
      modelName: selectedModel,
      variantName: selectedVariant,
      serviceId: selectedServiceId,
      addonIds: selectedAddonIds,
      pickupDrop,
      couponCode: appliedCoupon
    });
  }, [selectedBrand, selectedModel, selectedVariant, selectedServiceId, selectedAddonIds, pickupDrop, appliedCoupon]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) {
      setAppliedCoupon('');
      return;
    }
    const testCalc = PricingService.calculatePricing({
      brandName: selectedBrand,
      modelName: selectedModel,
      variantName: selectedVariant,
      serviceId: selectedServiceId,
      addonIds: selectedAddonIds,
      pickupDrop,
      couponCode: couponInput.trim().toUpperCase()
    });

    if (testCalc.couponCode) {
      setAppliedCoupon(testCalc.couponCode);
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon or minimum order value not reached.');
    }
  };

  // Submit Booking
  const handleConfirmBooking = () => {
    const booking = BookingService.createBooking({
      userId: currentUser.id,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress: pickupAddress,
      vehicleBrand: selectedBrand,
      vehicleModel: selectedModel,
      vehicleVariant: selectedVariant,
      vehicleRegNumber: regNumber,
      fuelType,
      serviceId: selectedServiceId,
      addonIds: selectedAddonIds,
      serviceDate: selectedDate,
      serviceTime: selectedTimeSlot,
      pickupDrop,
      pickupAddress: pickupDrop !== 'garage_drop' ? pickupAddress : undefined,
      additionalNotes,
      couponCode: appliedCoupon
    });

    setCreatedBookingId(booking.id);
    setStep(7); // Success screen
  };

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TORQX AutoCare//Service Booking//EN
BEGIN:VEVENT
SUMMARY:Car Service: ${selectedBrand} ${selectedModel} at TORQX AutoCare
DESCRIPTION:Service: ${selectedServiceId}. Booking ID: ${createdBookingId}. Workshop: 123 Automotive Avenue, Baner, Pune.
LOCATION:123 Automotive Avenue, Baner, Pune, MH 411045
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${createdBookingId}-TORQX-Booking.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredServices = useMemo(() => {
    if (serviceCategoryFilter === 'all') return COMPREHENSIVE_SERVICES;
    return COMPREHENSIVE_SERVICES.filter((s) => s.category === serviceCategoryFilter);
  }, [serviceCategoryFilter]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#0f131a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-neutral-200">
      {/* Wizard Header */}
      <div className="bg-[#141922] border-b border-white/10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ff5500]"></span>
            <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#ff5500]">
              TORQX Precision Booking System
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide">
            Book Your Service Appointment
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time dynamic pricing tailored to your car's exact model, variant & powertrain.
          </p>
        </div>

        {/* Step Indicator Pills (Desktop) */}
        {step < 7 && (
          <div className="hidden lg:flex items-center gap-2 bg-[#090b0f] p-2 rounded-xl border border-white/5">
            {[
              { num: 1, label: 'Vehicle' },
              { num: 2, label: 'Service' },
              { num: 3, label: 'Add-ons' },
              { num: 4, label: 'Slot' },
              { num: 5, label: 'Details' },
              { num: 6, label: 'Review' }
            ].map((s) => (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-tech tracking-wider cursor-pointer transition-colors ${
                  step === s.num
                    ? 'bg-[#ff5500] text-white font-bold'
                    : s.num < step
                    ? 'bg-white/10 text-neutral-200 hover:bg-white/15'
                    : 'text-neutral-500 cursor-not-allowed'
                }`}
              >
                <span>{s.num}.</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {step < 7 && (
        <div className="w-full bg-white/5 h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#ff5500] to-amber-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      )}

      {/* Wizard Content Body */}
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: SELECT VEHICLE */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-[#ff5500]" />
                    Step 1: Select Your Vehicle
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Select your vehicle brand, model, and engine variant for calibrated pricing.
                  </p>
                </div>
                <span className="text-xs font-tech uppercase tracking-wider px-3 py-1 rounded bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30">
                  {currentModelObj?.category.toUpperCase()} CATEGORY
                </span>
              </div>

              {/* Brands Grid */}
              <div>
                <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                  1. Brand
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {VEHICLE_DATABASE.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => handleBrandChange(b.name)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                        selectedBrand === b.name
                          ? 'bg-[#ff5500]/15 border-[#ff5500] text-white shadow-lg shadow-[#ff5500]/20'
                          : 'bg-[#141922] border-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="font-bold text-sm text-white">{b.name}</span>
                      <span className="text-[10px] font-tech uppercase tracking-wider text-neutral-400">
                        {b.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Models Grid */}
              <div>
                <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                  2. Model ({selectedBrand})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {currentModels.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => handleModelChange(m.name)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        selectedModel === m.name
                          ? 'bg-white/10 border-white/30 text-white shadow'
                          : 'bg-[#141922] border-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="font-semibold text-sm text-white">{m.name}</span>
                      <span className="text-[11px] text-neutral-400 mt-1">
                        {m.variants.length} Variants
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Variants & Fuel Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                    3. Trim / Powertrain Variant
                  </label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full bg-[#141922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
                  >
                    {currentVariants.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                    4. Fuel Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'] as FuelType[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFuelType(f)}
                        className={`px-3.5 py-2.5 rounded-xl border text-xs font-tech uppercase tracking-wider transition-colors ${
                          fuelType === f
                            ? 'bg-[#ff5500] border-[#ff5500] text-white font-bold'
                            : 'bg-[#141922] border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Registration Number Field */}
              <div>
                <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                  5. Vehicle Registration Number (Optional / Can add later)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MH 12 AB 1234"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                  className="w-full max-w-sm bg-[#141922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white tracking-widest font-mono focus:border-[#ff5500] focus:outline-none"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT SERVICE */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#ff5500]" />
                    Step 2: Choose Service Package
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Pricing tailored for <strong className="text-white">{selectedBrand} {selectedModel}</strong> ({currentModelObj?.category.toUpperCase()}).
                  </p>
                </div>

                {/* Category filters */}
                <div className="flex items-center gap-1 bg-[#141922] p-1 rounded-xl border border-white/5">
                  {(['all', 'mechanical', 'diagnostics', 'detailing'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setServiceCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-tech uppercase tracking-wider transition-colors ${
                        serviceCategoryFilter === cat
                          ? 'bg-[#ff5500] text-white font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
                {filteredServices.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  const priceDisplay = PricingService.getServicePriceDisplay(
                    service.id,
                    selectedBrand,
                    selectedModel
                  );

                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#ff5500]/10 border-[#ff5500] ring-1 ring-[#ff5500]'
                          : 'bg-[#141922] border-white/5 hover:border-white/20'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 text-[#ff5500]">
                          <CheckCircle2 className="w-5 h-5" />
                        </span>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-tech uppercase tracking-widest text-[#ff5500] px-2 py-0.5 rounded bg-white/5">
                            {service.category}
                          </span>
                          <span className="text-xs text-neutral-400 flex items-center gap-1 font-tech">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            {service.duration}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-white">{service.title}</h4>
                        <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                          {service.shortDesc}
                        </p>

                        <div className="mt-3 space-y-1">
                          {service.features.slice(0, 2).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                              <span className="w-1 h-1 rounded-full bg-[#ff5500]" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-end justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-400 block font-tech uppercase tracking-wider">
                            Estimated Starting Price
                          </span>
                          <span className="text-lg font-extrabold text-white font-tech">
                            {priceDisplay.display}
                          </span>
                        </div>
                        {service.isInspectionDependent && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            Inspection Subject
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: SELECT ADD-ONS */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-[#ff5500]" />
                  Step 3: Recommended Add-on Enhancements
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Select optional maintenance enhancements for your {selectedBrand} {selectedModel}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[450px] overflow-y-auto pr-1">
                {ADDON_OPTIONS.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  const price =
                    currentModelObj.category === 'luxury'
                      ? addon.priceLuxury
                      : currentModelObj.category === 'premium'
                      ? addon.pricePremium
                      : addon.priceEconomy;

                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'bg-[#ff5500]/10 border-[#ff5500]'
                          : 'bg-[#141922] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 accent-[#ff5500] w-4 h-4 rounded cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{addon.title}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">{addon.description}</p>
                          <span className="text-[10px] text-neutral-500 font-tech mt-1 block">
                            Duration: {addon.duration}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-white font-tech">
                          +₹{price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: APPOINTMENT & PICKUP/DROP */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ff5500]" />
                  Step 4: Appointment Date & Logistics
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Pick your preferred date slot and convenient vehicle delivery method.
                </p>
              </div>

              {/* Available Dates Horizontal Scroll */}
              <div>
                <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                  Select Date (Next 14 Days)
                </label>
                <div className="flex gap-2.5 overflow-x-auto pb-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDate(d.iso)}
                      className={`min-w-[76px] p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center shrink-0 ${
                        selectedDate === d.iso
                          ? 'bg-[#ff5500] border-[#ff5500] text-white shadow-lg shadow-[#ff5500]/25'
                          : 'bg-[#141922] border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="text-[11px] font-tech uppercase">{d.dayName}</span>
                      <span className="text-xl font-extrabold font-display my-0.5">{d.dateNum}</span>
                      <span className="text-[10px] font-tech uppercase">{d.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                  Preferred Workshop Arrival Time
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl border text-xs font-tech uppercase tracking-wider transition-colors text-center ${
                        selectedTimeSlot === slot
                          ? 'bg-white/15 border-white/40 text-white font-bold'
                          : 'bg-[#141922] border-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup & Drop options */}
              <div>
                <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                  Vehicle Transfer Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'garage_drop',
                      title: 'Self Drop & Pickup',
                      price: 'FREE',
                      desc: 'Bring vehicle to our Baner Workshop facility.'
                    },
                    {
                      id: 'pickup_only',
                      title: 'Doorstep Pickup Only',
                      price: '+₹299',
                      desc: 'Chauffeur picks up your car from home or office.'
                    },
                    {
                      id: 'pickup_and_drop',
                      title: 'Round-Trip Pickup & Drop',
                      price: '+₹499',
                      desc: 'Full valet service. We pick up and return your vehicle.'
                    }
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setPickupDrop(opt.id as any)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        pickupDrop === opt.id
                          ? 'bg-[#ff5500]/10 border-[#ff5500]'
                          : 'bg-[#141922] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-white">{opt.title}</span>
                        <span className="text-xs font-tech font-bold text-[#ff5500]">
                          {opt.price}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup Address (if pickup requested) */}
              {pickupDrop !== 'garage_drop' && (
                <div>
                  <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#ff5500]" />
                    Pune Pickup & Return Address
                  </label>
                  <textarea
                    rows={2}
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Enter full flat/villa number, society, street and landmark in Pune..."
                    className="w-full bg-[#141922] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 5: CUSTOMER DETAILS */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#ff5500]" />
                  Step 5: Customer & Vehicle Notes
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Who should our service advisors reach out to for updates and approvals?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#141922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                    Phone Number (WhatsApp updates)
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#141922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ff5500] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                    Email Address (For Invoices & Reports)
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#141922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                    Vehicle Reg Number
                  </label>
                  <input
                    type="text"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                    className="w-full bg-[#141922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ff5500] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2">
                  Special Concerns / Diagnostics Requests
                </label>
                <textarea
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. Squeaking sound during cold morning starts, slight vibration at 100 km/h, check AC cooling performance..."
                  className="w-full bg-[#141922] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 6: PRICE SUMMARY & REVIEW */}
          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#ff5500]" />
                  Step 6: Review & Transparent Price Breakdown
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Review all selected services, parts estimate, and apply promotional coupons before confirmation.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Summary details */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Selected Vehicle Card */}
                  <div className="p-4 rounded-xl bg-[#141922] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-tech uppercase tracking-wider text-neutral-400">
                        Vehicle Selected
                      </span>
                      <h4 className="font-extrabold text-white text-base">
                        {selectedBrand} {selectedModel}
                      </h4>
                      <p className="text-xs text-neutral-400">
                        {selectedVariant} • {fuelType} • Reg: {regNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs font-tech uppercase text-[#ff5500] hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  {/* Selected Service & Schedule Card */}
                  <div className="p-4 rounded-xl bg-[#141922] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-tech uppercase tracking-wider text-neutral-400">
                        Service Package & Slot
                      </span>
                      <h4 className="font-extrabold text-white text-base">
                        {COMPREHENSIVE_SERVICES.find((s) => s.id === selectedServiceId)?.title}
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Date: {selectedDate} • Time: {selectedTimeSlot} • {pickupDrop === 'garage_drop' ? 'Workshop Drop' : 'Doorstep Valet'}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs font-tech uppercase text-[#ff5500] hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  {/* Add-ons List */}
                  {selectedAddonIds.length > 0 && (
                    <div className="p-4 rounded-xl bg-[#141922] border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-tech uppercase tracking-wider text-neutral-400">
                          Selected Add-ons ({selectedAddonIds.length})
                        </span>
                        <button
                          onClick={() => setStep(3)}
                          className="text-xs font-tech uppercase text-[#ff5500] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {selectedAddonIds.map((id) => {
                          const addon = ADDON_OPTIONS.find((a) => a.id === id);
                          return (
                            <div key={id} className="flex justify-between text-xs text-neutral-300">
                              <span>• {addon?.title}</span>
                              <span className="font-tech text-white">
                                ₹{currentModelObj.category === 'luxury' ? addon?.priceLuxury : currentModelObj.category === 'premium' ? addon?.pricePremium : addon?.priceEconomy}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="p-4 rounded-xl bg-[#141922] border border-white/10">
                    <label className="block text-xs font-tech uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#ff5500]" />
                      Promotional Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="e.g. TORQX10, FIRSTSERVICE"
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-[#ff5500]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-tech uppercase text-xs tracking-wider rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {couponError}
                      </p>
                    )}
                    {appliedCoupon && !couponError && (
                      <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Coupon <strong>{appliedCoupon}</strong> successfully applied!
                      </p>
                    )}
                  </form>
                </div>

                {/* Right 1 Col: Itemized Price Card */}
                <div className="p-5 rounded-xl bg-gradient-to-b from-[#181e28] to-[#10141c] border border-white/10 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-white text-sm font-tech uppercase tracking-wider pb-3 border-b border-white/10">
                      Pricing Summary
                    </h4>

                    <div className="space-y-2.5 py-4 text-xs">
                      <div className="flex justify-between text-neutral-300">
                        <span>Service Base Package</span>
                        <span className="font-mono text-white font-semibold">
                          ₹{priceBreakdown.serviceBasePrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex justify-between text-neutral-300">
                        <span>Estimated OEM Parts</span>
                        <span className="font-mono text-white">
                          ₹{priceBreakdown.partsEstimate.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex justify-between text-neutral-300">
                        <span>Calibrated Labour Charges</span>
                        <span className="font-mono text-white">
                          ₹{priceBreakdown.labourCharges.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {priceBreakdown.addonsTotal > 0 && (
                        <div className="flex justify-between text-neutral-300">
                          <span>Add-ons Total</span>
                          <span className="font-mono text-white">
                            ₹{priceBreakdown.addonsTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      {priceBreakdown.pickupDropFee > 0 && (
                        <div className="flex justify-between text-neutral-300">
                          <span>Doorstep Valet Transfer</span>
                          <span className="font-mono text-white">
                            ₹{priceBreakdown.pickupDropFee.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-white/10 flex justify-between text-neutral-300">
                        <span>Subtotal</span>
                        <span className="font-mono text-white font-bold">
                          ₹{priceBreakdown.subtotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {priceBreakdown.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Coupon Discount ({priceBreakdown.couponCode})</span>
                          <span className="font-mono font-bold">
                            -₹{priceBreakdown.discountAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-neutral-400 text-[11px]">
                        <span>GST @ 18% (Govt. mandated)</span>
                        <span className="font-mono">
                          +₹{priceBreakdown.gstAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="font-tech uppercase text-xs tracking-wider text-neutral-400">
                        Grand Total
                      </span>
                      <span className="text-2xl font-extrabold text-[#ff5500] font-tech">
                        ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {priceBreakdown.isInspectionSubject && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 mb-3 flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                        <span>
                          Starting estimate. Final price may vary after vehicle physical inspection.
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/30 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Reserve Slot</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 7: BOOKING CONFIRMED SCREEN */}
          {step === 7 && createdBookingId && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 px-4 max-w-2xl mx-auto space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-tech font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Service Slot Confirmed
                </span>
                <h3 className="text-3xl font-display font-extrabold text-white mt-3">
                  Booking Reference ID
                </h3>
                <div className="inline-block mt-2 px-4 py-2 rounded-xl bg-black/60 border border-white/15 text-xl font-mono font-extrabold tracking-widest text-[#ff5500]">
                  {createdBookingId}
                </div>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                Thank you, <strong>{customerName}</strong>! Your service slot for your{' '}
                <strong>{selectedBrand} {selectedModel}</strong> has been scheduled for{' '}
                <strong>{selectedDate}</strong> ({selectedTimeSlot}). Our Master Service Advisor will
                contact you on <strong>{customerPhone}</strong>.
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => navigate(`/service/${createdBookingId}`)}
                  className="py-3 px-4 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/30 transition-all flex items-center justify-center gap-2"
                >
                  <Car className="w-4 h-4" />
                  <span>Track Live Service Status</span>
                </button>

                <a
                  href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=Hello%20TORQX%20AutoCare%2C%20I%20have%20booked%20service%20${createdBookingId}%20for%20my%20${selectedBrand}%20${selectedModel}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Confirmation</span>
                </a>

                <button
                  onClick={handleDownloadICS}
                  className="py-3 px-4 rounded-xl bg-[#141922] hover:bg-white/10 text-neutral-200 border border-white/10 font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4 text-neutral-400" />
                  <span>Add to Calendar (.ics)</span>
                </button>

                <button
                  onClick={() => navigate('/dashboard/bookings')}
                  className="py-3 px-4 rounded-xl bg-[#141922] hover:bg-white/10 text-neutral-200 border border-white/10 font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-neutral-400" />
                  <span>View in Customer Garage</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Wizard Footer Navigation */}
      {step < 7 && (
        <div className="bg-[#141922] border-t border-white/10 p-5 sm:px-8 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-tech uppercase tracking-wider transition-colors ${
              step === 1
                ? 'text-neutral-600 cursor-not-allowed'
                : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-neutral-500 font-tech uppercase block">
                Estimated Total (Incl. GST)
              </span>
              <span className="text-base font-extrabold text-white font-tech">
                ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (step < 6) {
                  setStep((s) => s + 1);
                } else {
                  handleConfirmBooking();
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/25 transition-all"
            >
              <span>{step === 6 ? 'Confirm Booking' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
