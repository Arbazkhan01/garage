import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Calendar,
  Layers,
  Wrench,
  DollarSign,
  Users,
  Tag,
  Star,
  Settings,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Filter,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Edit2
} from 'lucide-react';
import {
  Booking,
  ServiceStatus,
  ServiceBay,
  Technician,
  Invoice,
  Coupon,
  ReviewItem
} from '../types';
import { BookingService } from '../services/bookingService';
import { StorageService, STORAGE_KEYS } from '../services/storageService';
import { COMPREHENSIVE_SERVICES } from '../data/pricingData';
import { VEHICLE_DATABASE } from '../data/vehicleData';
import { PricingService } from '../services/pricingService';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bays, setBays] = useState<ServiceBay[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Pricing Matrix test calculator state
  const [calcBrand, setCalcBrand] = useState('BMW');
  const [calcModel, setCalcModel] = useState('3 Series');
  const [calcService, setCalcService] = useState('periodic-service');

  // Create Coupon Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [newCouponMin, setNewCouponMin] = useState(2500);

  const loadAll = () => {
    setBookings(BookingService.getAllBookings());
    setBays(StorageService.get<ServiceBay[]>(STORAGE_KEYS.BAYS, []));
    setTechnicians(StorageService.get<Technician[]>(STORAGE_KEYS.TECHNICIANS, []));
    setInvoices(StorageService.get<Invoice[]>(STORAGE_KEYS.INVOICES, []));
    setCoupons(StorageService.get<Coupon[]>(STORAGE_KEYS.COUPONS, []));
    setReviews(StorageService.get<ReviewItem[]>(STORAGE_KEYS.REVIEWS, []));
  };

  useEffect(() => {
    loadAll();
    window.addEventListener('storage', loadAll);
    return () => window.removeEventListener('storage', loadAll);
  }, []);

  // Update booking status from admin
  const handleStatusChange = (bookingId: string, newStatus: ServiceStatus) => {
    BookingService.updateBookingStatus(bookingId, newStatus);
    loadAll();
  };

  // Assign technician to booking
  const handleAssignTechnician = (bookingId: string, techId: string) => {
    BookingService.assignTechnician(bookingId, techId);
    loadAll();
  };

  // Assign bay to booking
  const handleAssignBay = (bookingId: string, bayNumber: string) => {
    BookingService.assignBay(bookingId, bayNumber);
    loadAll();
  };

  // Bay toggle status
  const handleToggleBayStatus = (bayId: string) => {
    const updated = bays.map((b) => {
      if (b.id === bayId) {
        const nextStatus = b.status === 'occupied' ? 'empty' : 'occupied';
        return { ...b, status: nextStatus as any };
      }
      return b;
    });
    setBays(updated);
    StorageService.set(STORAGE_KEYS.BAYS, updated);
  };

  // Moderate review
  const handleToggleReview = (id: string) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r));
    setReviews(updated);
    StorageService.set(STORAGE_KEYS.REVIEWS, updated);
  };

  // Create coupon submit
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newCoupon: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      description: `${newCouponType === 'percentage' ? `${newCouponDiscount}%` : `₹${newCouponDiscount}`} workshop discount`,
      discountType: newCouponType,
      value: Number(newCouponDiscount),
      minOrder: Number(newCouponMin),
      validUntil: '2026-12-31',
      active: true
    };
    const updated = [...coupons, newCoupon];
    setCoupons(updated);
    StorageService.set(STORAGE_KEYS.COUPONS, updated);
    setShowCouponModal(false);
    setNewCouponCode('');
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.vehicleBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.vehicleRegNumber && b.vehicleRegNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Pricing matrix test result
  const calculatedTestPrice = useMemo(() => {
    return PricingService.calculatePricing({
      brandName: calcBrand,
      modelName: calcModel,
      serviceId: calcService,
      pickupDrop: 'garage_drop'
    });
  }, [calcBrand, calcModel, calcService]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-tech font-bold uppercase tracking-widest text-amber-400">
              TORQX Master Workshop Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide">
            Garage Operations & Diagnostics Admin
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Live bay allocation, job cards, technician rosters, pricing management, and invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/service/TORQX-2026-00482')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Car className="w-4 h-4 text-[#ff5500]" />
            <span>Open Customer Tracker</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Bookings', val: bookings.length, sub: 'All recorded jobs' },
          { label: 'In Garage Bays', val: bays.filter((b) => b.status === 'occupied').length, sub: `${bays.length} active lifts` },
          { label: 'Master Techs', val: technicians.length, sub: 'Certified engineers' },
          { label: 'Gross Revenue', val: `₹${invoices.reduce((acc, i) => acc + i.total, 0).toLocaleString('en-IN')}`, sub: 'Billed invoices' },
          { label: 'Active Promo Codes', val: coupons.length, sub: 'Valid marketing vouchers' }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#12161f] border border-white/10 rounded-xl p-5">
            <span className="text-xs font-tech uppercase tracking-wider text-neutral-400 block">
              {kpi.label}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-white font-tech my-1 block">
              {kpi.val}
            </span>
            <span className="text-[11px] text-neutral-500">{kpi.sub}</span>
          </div>
        ))}
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'bookings', label: `Service Bookings (${bookings.length})`, icon: Calendar },
          { id: 'bays', label: `Workshop Bays Floorplan (${bays.length})`, icon: Layers },
          { id: 'pricing', label: 'Dynamic Pricing Matrix', icon: DollarSign },
          { id: 'technicians', label: `Technicians Roster (${technicians.length})`, icon: Users },
          { id: 'invoices', label: `Invoices & Billing (${invoices.length})`, icon: DollarSign },
          { id: 'coupons', label: `Coupons & Offers (${coupons.length})`, icon: Tag },
          { id: 'reviews', label: `Customer Reviews (${reviews.length})`, icon: Star }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-tech text-xs uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                isActive
                  ? 'border-amber-400 text-white font-bold bg-white/5'
                  : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Controls: Search & Status Filter */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Booking ID, Customer Name, Vehicle or Reg#..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-tech uppercase"
              >
                <option value="all">All Statuses</option>
                <option value="booking_confirmed">Booking Confirmed</option>
                <option value="inspection">Inspection</option>
                <option value="quote_sent">Quote Sent</option>
                <option value="work_in_progress">Work In Progress</option>
                <option value="quality_check">Quality Check</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-3">Booking ID</th>
                  <th className="py-3 px-3">Customer & Contact</th>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Service Package</th>
                  <th className="py-3 px-3">Assigned Bay</th>
                  <th className="py-3 px-3">Technician</th>
                  <th className="py-3 px-3">Status Pipeline</th>
                  <th className="py-3 px-3 text-right">Total (INR)</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-[#ff5500] block">{b.id}</span>
                      <span className="text-[10px] text-neutral-500 font-tech">{b.serviceDate}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <strong className="text-white block">{b.customerName}</strong>
                      <span className="text-neutral-400 text-[11px] font-mono">{b.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-white block font-medium">
                        {b.vehicleBrand} {b.vehicleModel}
                      </span>
                      <span className="text-neutral-400 text-[10px] font-mono">
                        {b.vehicleRegNumber || 'Reg Pending'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-300">{b.serviceName}</td>

                    {/* Bay Select */}
                    <td className="py-3.5 px-3">
                      <select
                        value={b.bayNumber || 'Bay 01'}
                        onChange={(e) => handleAssignBay(b.id, e.target.value)}
                        className="bg-black/60 border border-white/10 rounded px-2 py-1 text-white font-tech text-[11px]"
                      >
                        <option value="Bay 01">Bay 01 (Diag)</option>
                        <option value="Bay 02">Bay 02 (Lift)</option>
                        <option value="Bay 03">Bay 03 (Quick)</option>
                        <option value="Bay 04">Bay 04 (Brake)</option>
                        <option value="Bay 05">Bay 05 (Hunter)</option>
                        <option value="Bay 06">Bay 06 (Detail)</option>
                      </select>
                    </td>

                    {/* Tech Select */}
                    <td className="py-3.5 px-3">
                      <select
                        value={b.technicianId || 'tech-1'}
                        onChange={(e) => handleAssignTechnician(b.id, e.target.value)}
                        className="bg-black/60 border border-white/10 rounded px-2 py-1 text-white font-tech text-[11px]"
                      >
                        {technicians.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status Select */}
                    <td className="py-3.5 px-3">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as ServiceStatus)}
                        className={`border rounded px-2.5 py-1 text-[11px] font-tech font-bold uppercase ${
                          b.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : b.status === 'work_in_progress'
                            ? 'bg-[#ff5500]/20 text-[#ff5500] border-[#ff5500]/40'
                            : 'bg-black/60 text-white border-white/15'
                        }`}
                      >
                        <option value="booking_confirmed">01. Booking Confirmed</option>
                        <option value="vehicle_received">02. Vehicle Received</option>
                        <option value="inspection">03. Inspection</option>
                        <option value="diagnosis">04. Diagnosis</option>
                        <option value="quote_sent">05. Quote Sent</option>
                        <option value="quote_approved">06. Quote Approved</option>
                        <option value="work_in_progress">07. Work In Progress</option>
                        <option value="quality_check">08. Quality Check</option>
                        <option value="ready_for_pickup">09. Ready For Pickup</option>
                        <option value="completed">10. Completed</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      ₹{b.priceBreakdown.grandTotal.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => navigate(`/service/${b.id}`)}
                        className="p-1 text-neutral-400 hover:text-white"
                        title="View Live Tracker"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WORKSHOP BAYS FLOORPLAN */}
      {activeTab === 'bays' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Workshop Bays Floorplan (Baner Facility)</h3>
              <p className="text-xs text-neutral-400">
                Live status of all 6 dedicated hydraulic lift & diagnostic bays.
              </p>
            </div>
            <span className="text-xs font-tech uppercase text-neutral-400">
              Occupied: {bays.filter((b) => b.status === 'occupied').length} / {bays.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bays.map((bay) => (
              <div
                key={bay.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  bay.status === 'occupied'
                    ? 'bg-[#181f2c] border-[#ff5500]/40 shadow-lg'
                    : 'bg-black/30 border-white/10 opacity-70'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-tech font-bold uppercase tracking-wider text-neutral-400">
                      {bay.type}
                    </span>
                    <button
                      onClick={() => handleToggleBayStatus(bay.id)}
                      className={`text-[10px] font-tech font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        bay.status === 'occupied'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {bay.status.toUpperCase()} (Toggle)
                    </button>
                  </div>

                  <h4 className="font-extrabold text-lg text-white">{bay.name}</h4>

                  {bay.status === 'occupied' ? (
                    <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-200 font-medium">
                        <Car className="w-3.5 h-3.5 text-[#ff5500]" />
                        <span>{bay.vehicleModel || 'BMW 330i M Sport'}</span>
                      </div>
                      <p className="text-neutral-400 font-mono text-[11px]">
                        Booking: {bay.currentBookingId || 'TORQX-2026-00482'}
                      </p>
                      <p className="text-neutral-400 text-[11px]">
                        Lead: {bay.technicianName || 'Rahul Sharma'}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 p-4 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-neutral-500">
                      Bay Ready For Vehicle Check-in
                    </div>
                  )}
                </div>

                {bay.currentBookingId && (
                  <button
                    onClick={() => navigate(`/service/${bay.currentBookingId}`)}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech text-xs uppercase tracking-wider transition-colors"
                  >
                    View Active Bay Job
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC PRICING MATRIX */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Dynamic Pricing Engine & Matrix</h3>
              <p className="text-xs text-neutral-400">
                Rule: Category Base (Economy / Premium / Luxury) × Trim Multiplier + Parts Ratio + Labour + Addons + 18% GST.
              </p>
            </div>

            {/* Live Pricing Test Sandbox */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <h4 className="font-bold text-white text-sm uppercase font-tech tracking-wider text-amber-400">
                Interactive Pricing Simulator
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Brand</label>
                  <select
                    value={calcBrand}
                    onChange={(e) => {
                      setCalcBrand(e.target.value);
                      const b = VEHICLE_DATABASE.find((item) => item.name === e.target.value);
                      if (b && b.models.length > 0) setCalcModel(b.models[0].name);
                    }}
                    className="w-full bg-[#12161f] border border-white/10 rounded-xl p-3 text-white"
                  >
                    {VEHICLE_DATABASE.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} ({b.category.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Model</label>
                  <select
                    value={calcModel}
                    onChange={(e) => setCalcModel(e.target.value)}
                    className="w-full bg-[#12161f] border border-white/10 rounded-xl p-3 text-white"
                  >
                    {VEHICLE_DATABASE.find((b) => b.name === calcBrand)?.models.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Service Package</label>
                  <select
                    value={calcService}
                    onChange={(e) => setCalcService(e.target.value)}
                    className="w-full bg-[#12161f] border border-white/10 rounded-xl p-3 text-white"
                  >
                    {COMPREHENSIVE_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Result Display */}
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 font-tech uppercase block">Computed Breakdown</span>
                  <span className="text-white font-mono">
                    Base: ₹{calculatedTestPrice.serviceBasePrice.toLocaleString('en-IN')} + Parts: ₹{calculatedTestPrice.partsEstimate.toLocaleString('en-IN')} + Labour: ₹{calculatedTestPrice.labourCharges.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 font-tech uppercase block">GST @ 18%</span>
                  <span className="text-white font-mono">₹{calculatedTestPrice.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-tech uppercase font-bold block">Grand Total Output</span>
                  <span className="text-2xl font-extrabold text-[#ff5500] font-tech">
                    ₹{calculatedTestPrice.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Base Rates Catalog */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-right">Economy Base</th>
                    <th className="py-3 px-3 text-right">Premium Base</th>
                    <th className="py-3 px-3 text-right">Luxury Base</th>
                    <th className="py-3 px-3 text-center">Inspection Dependent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {COMPREHENSIVE_SERVICES.map((s) => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{s.title}</td>
                      <td className="py-3 px-3 text-neutral-400 uppercase font-tech">{s.category}</td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-300">
                        ₹{s.basePriceEconomy.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-300">
                        ₹{s.basePricePremium.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-white font-bold">
                        ₹{s.basePriceLuxury.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {s.isInspectionDependent ? (
                          <span className="text-amber-400 text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10">
                            Yes
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-[10px] font-tech uppercase">Fixed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TECHNICIANS ROSTER */}
      {activeTab === 'technicians' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Certified Master Technicians</h3>
              <p className="text-xs text-neutral-400">
                Roster of diagnostic leads, VAG specialists, and certified detailing artisans.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 shadow"
                    />
                    <div>
                      <h4 className="font-bold text-base text-white">{t.name}</h4>
                      <span className="text-xs font-tech text-[#ff5500] uppercase block">{t.role}</span>
                      <span className="text-xs text-amber-400 font-tech">★ {t.rating} Rating</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 bg-white/5 p-2.5 rounded-lg border border-white/5">
                    {t.specialization}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400 pt-2 border-t border-white/5">
                    <div>
                      <span className="block text-[10px] uppercase font-tech">Experience</span>
                      <strong className="text-white">{t.experienceYears} Years</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-tech">Completed Jobs</span>
                      <strong className="text-white">{t.completedJobs} Cars</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-mono">{t.phone}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-tech uppercase ${
                      t.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {t.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INVOICES & BILLING */}
      {activeTab === 'invoices' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">All Issued GST Invoices</h3>
              <p className="text-xs text-neutral-400">
                Official billing registers and payment collection status.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-3">Invoice Number</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Vehicle Details</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Amount (INR)</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#ff5500]">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-3 text-neutral-300 font-tech">{inv.date}</td>
                    <td className="py-3.5 px-3 text-white font-medium">{inv.customerName}</td>
                    <td className="py-3.5 px-3 text-neutral-400">{inv.vehicleDetails}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-tech font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          inv.paymentStatus === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      ₹{inv.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => navigate(`/service/${inv.bookingId}`)}
                        className="text-[#ff5500] hover:underline font-tech uppercase text-[11px]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: COUPONS & OFFERS */}
      {activeTab === 'coupons' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Coupons & Promotional Offers</h3>
              <p className="text-xs text-neutral-400">
                Manage discounts applied at booking checkout.
              </p>
            </div>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-5 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-base font-extrabold text-white tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {c.code}
                    </span>
                    <span className="text-xs text-emerald-400 font-tech font-bold">
                      {c.discountType === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-2">{c.description}</p>
                </div>

                <div className="text-[11px] text-neutral-500 pt-3 border-t border-white/5 flex justify-between font-tech">
                  <span>Min Order: ₹{c.minOrder.toLocaleString('en-IN')}</span>
                  <span>Valid until: {c.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Customer Reviews Moderation</h3>
              <p className="text-xs text-neutral-400">
                Approve verified customer feedback before it displays on the homepage.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">{r.name}</strong>
                    <span className="text-xs text-neutral-400 font-tech">({r.location})</span>
                    <span className="text-amber-400 font-tech text-xs">★ {r.rating}/5</span>
                  </div>
                  <p className="text-xs text-neutral-300 italic">"{r.quote}"</p>
                  <p className="text-[11px] text-neutral-500 font-tech">
                    Car: {r.carModel} • Service: {r.serviceType}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleReview(r.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-tech font-bold uppercase tracking-wider shrink-0 ${
                    r.approved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {r.approved ? 'Approved ✓' : 'Hidden ✕'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-white">Create New Workshop Coupon</h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Min Order Value (INR)</label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-neutral-300 font-tech uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-tech font-bold uppercase shadow"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
