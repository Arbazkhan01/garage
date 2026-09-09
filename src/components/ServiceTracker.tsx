import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Car,
  CheckCircle2,
  Clock,
  Wrench,
  FileText,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Phone,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Download,
  Share2,
  ChevronRight,
  Activity,
  Layers,
  FileCheck
} from 'lucide-react';
import { Booking, ServiceStatus, InspectionReport, Quotation, Technician } from '../types';
import { BookingService } from '../services/bookingService';
import { StorageService, STORAGE_KEYS } from '../services/storageService';
import { BRAND_INFO } from '../data/automotiveData';

const SERVICE_STAGES: { status: ServiceStatus; label: string; desc: string }[] = [
  { status: 'booking_confirmed', label: 'Booking Confirmed', desc: 'Slot reserved & bay scheduled.' },
  { status: 'vehicle_received', label: 'Vehicle Received', desc: 'Car checked in at workshop bay.' },
  { status: 'inspection', label: '60-Point Inspection', desc: 'Digital diagnostics & mechanical audit.' },
  { status: 'diagnosis', label: 'Diagnostic Analysis', desc: 'OBD scan and wear measurements.' },
  { status: 'quote_sent', label: 'Quotation Sent', desc: 'Awaiting customer scope approval.' },
  { status: 'quote_approved', label: 'Quote Approved', desc: 'Parts requisitioned from OEM.' },
  { status: 'work_in_progress', label: 'Work In Progress', desc: 'Technicians executing repairs.' },
  { status: 'quality_check', label: 'Quality Audit & Road Test', desc: 'Supervisor sign-off & detailing.' },
  { status: 'ready_for_pickup', label: 'Ready for Pickup', desc: 'Sanitized, polished & ready.' },
  { status: 'completed', label: 'Completed & Delivered', desc: 'Vehicle handed over with invoice.' }
];

export const ServiceTracker: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'inspection' | 'quotation' | 'invoice'>('timeline');

  // Quotation approval state
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null);

  const currentId = bookingId || 'TORQX-2026-00482';

  const loadData = () => {
    const b = BookingService.getBookingById(currentId);
    if (b) {
      setBooking(b);
    } else {
      // Default to first booking if not found
      const all = BookingService.getAllBookings();
      if (all.length > 0) setBooking(all[0]);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [currentId]);

  // Inspection Report
  const inspection: InspectionReport | undefined = useMemo(() => {
    if (!booking) return undefined;
    return BookingService.getInspectionReport(booking.id) || BookingService.getInspectionReport('TORQX-2026-00482');
  }, [booking]);

  // Quotation
  const quotation: Quotation | undefined = useMemo(() => {
    if (!booking) return undefined;
    return BookingService.getQuotation(booking.id) || BookingService.getQuotation('TORQX-2026-00475');
  }, [booking]);

  // Master Technician
  const technician: Technician | undefined = useMemo(() => {
    const techs = StorageService.get<Technician[]>(STORAGE_KEYS.TECHNICIANS, []);
    return techs.find((t) => t.id === booking?.technicianId) || techs[0];
  }, [booking]);

  const currentStageIndex = useMemo(() => {
    if (!booking) return 0;
    const idx = SERVICE_STAGES.findIndex((s) => s.status === booking.status);
    return idx !== -1 ? idx : 0;
  }, [booking]);

  // Admin / Tech Simulator: Advance Status
  const handleAdvanceStatus = () => {
    if (!booking) return;
    const nextIdx = (currentStageIndex + 1) % SERVICE_STAGES.length;
    const nextStatus = SERVICE_STAGES[nextIdx].status;
    BookingService.updateBookingStatus(booking.id, nextStatus);
    loadData();
  };

  const handleSetStatus = (status: ServiceStatus) => {
    if (!booking) return;
    BookingService.updateBookingStatus(booking.id, status);
    loadData();
  };

  const handleApproveQuotation = () => {
    if (!booking) return;
    BookingService.updateQuotationStatus(booking.id, 'approved');
    setQuoteSuccessMsg('Quotation approved! Workshop notified to commence repair.');
    setTimeout(() => setQuoteSuccessMsg(null), 4000);
    loadData();
  };

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center text-neutral-400">
        <Car className="w-12 h-12 text-neutral-600 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white mb-2">Booking Record Not Found</h3>
        <p className="text-sm max-w-md mb-6">
          We could not locate booking reference ID "{currentId}". You can search another ID or view our demo car tracker.
        </p>
        <button
          onClick={() => navigate('/service/TORQX-2026-00482')}
          className="px-6 py-2.5 rounded-xl bg-[#ff5500] text-white font-tech font-bold text-xs uppercase tracking-wider"
        >
          Track Demo BMW 330i
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner Card: Vehicle & Bay Info */}
      <div className="bg-gradient-to-r from-[#141922] via-[#10141c] to-[#0c0e14] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5500]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Vehicle & Customer Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30 text-xs font-tech font-bold uppercase tracking-wider">
                Active Service ID: {booking.id}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-tech text-neutral-300">
                {booking.bayNumber || 'Bay 01 - Diagnostic Hub'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-wide">
              {booking.vehicleBrand} {booking.vehicleModel}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              {booking.vehicleVariant} • Reg: <strong className="text-neutral-200 font-mono">{booking.vehicleRegNumber}</strong> • Owner: <strong className="text-white">{booking.customerName}</strong>
            </p>
          </div>

          {/* Master Tech Card & Estimated Completion */}
          <div className="flex flex-wrap items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10">
            {technician && (
              <div className="flex items-center gap-3">
                <img
                  src={technician.avatar}
                  alt={technician.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#ff5500]/40 shadow"
                />
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-tech block">
                    Assigned Master Technician
                  </span>
                  <h4 className="font-bold text-sm text-white">{technician.name}</h4>
                  <span className="text-xs text-amber-400 font-tech">★ {technician.rating} Rating</span>
                </div>
              </div>
            )}

            <div className="h-10 w-px bg-white/10 hidden sm:block" />

            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-tech block">
                Estimated Delivery
              </span>
              <span className="text-sm font-extrabold text-white font-tech">
                {booking.estimatedCompletion || 'Today, 6:30 PM'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>On Schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Advance Control Tool */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-tech text-neutral-400 uppercase text-[11px]">
              Live Simulator:
            </span>
            <button
              onClick={handleAdvanceStatus}
              className="px-3 py-1 rounded bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech uppercase text-[11px] font-bold tracking-wider transition-colors shadow"
            >
              Advance Stage ➔
            </button>
            <select
              value={booking.status}
              onChange={(e) => handleSetStatus(e.target.value as ServiceStatus)}
              className="bg-black/60 border border-white/15 rounded px-2.5 py-1 text-white font-tech text-xs"
            >
              {SERVICE_STAGES.map((s) => (
                <option key={s.status} value={s.status}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=Inquiry%20regarding%20booking%20${booking.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-tech text-xs tracking-wider transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Service Advisor WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'timeline', label: '10-Step Service Pipeline', icon: Layers },
          { id: 'inspection', label: 'Digital Vehicle Inspection Report', icon: Activity },
          { id: 'quotation', label: 'Quotation & Parts Scope', icon: FileCheck },
          { id: 'invoice', label: 'Invoice & Price Breakdown', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-tech text-xs uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                isActive
                  ? 'border-[#ff5500] text-white font-bold bg-white/5'
                  : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff5500]' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#ff5500]" />
              Interactive Service Progression
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Live updates as our master technicians inspect, calibrate, and road-test your vehicle.
            </p>
          </div>

          {/* 10 Step Vertical / Responsive Timeline */}
          <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
            {SERVICE_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <div key={stage.status} className="flex items-start gap-4 relative">
                  {/* Step Node */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      isPast
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                        : isCurrent
                        ? 'bg-[#ff5500] text-white ring-4 ring-[#ff5500]/30 shadow-lg shadow-[#ff5500]/40 animate-pulse'
                        : 'bg-[#1a212c] text-neutral-500 border border-white/10'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    ) : isCurrent ? (
                      <Wrench className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-tech font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Details Card */}
                  <div
                    className={`flex-1 p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-[#ff5500]/10 border-[#ff5500]/50'
                        : isPast
                        ? 'bg-white/5 border-white/5 opacity-85'
                        : 'bg-black/20 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-tech font-bold uppercase text-neutral-400">
                          Phase 0{idx + 1}
                        </span>
                        <h4 className="font-bold text-base text-white">{stage.label}</h4>
                      </div>

                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ff5500] text-white text-[10px] font-tech font-bold uppercase tracking-wider self-start sm:self-auto">
                          In Progress
                        </span>
                      )}
                      {isPast && (
                        <span className="text-xs text-emerald-400 font-tech font-bold">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 mt-1">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: DIGITAL INSPECTION REPORT */}
      {activeTab === 'inspection' && inspection && (
        <div className="space-y-6">
          {/* Health Score Overview */}
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-tech uppercase tracking-widest text-[#ff5500]">
                TORQX Precision Health Audit
              </span>
              <h3 className="text-2xl font-bold text-white">Digital Vehicle Inspection Certification</h3>
              <p className="text-xs text-neutral-300 max-w-xl">
                Conducted by <strong>{inspection.technicianName}</strong> on {inspection.date} at{' '}
                <strong>{inspection.odometer.toLocaleString('en-IN')} KM</strong>.
              </p>
            </div>

            {/* Score Ring */}
            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center font-display font-extrabold text-2xl text-emerald-400 shadow-lg shadow-emerald-500/20">
                {inspection.overallHealthScore}
              </div>
              <div>
                <span className="text-xs font-tech uppercase tracking-wider text-neutral-400 block">
                  Overall Health Score
                </span>
                <span className="text-sm font-bold text-emerald-400">Excellent Condition (92/100)</span>
              </div>
            </div>
          </div>

          {/* Inspection Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(inspection.categories).map(([key, cat]) => (
              <div key={key} className="bg-[#12161f] border border-white/10 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#ff5500]" />
                    {cat.title}
                  </h4>
                  <span className="text-[10px] font-tech uppercase tracking-wider text-neutral-400">
                    {cat.items.length} Checked
                  </span>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-200 font-medium">{item.name}</span>
                        <span
                          className={`text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded ${
                            item.status === 'GOOD'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : item.status === 'ATTENTION'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/15 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {item.measurement && (
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Telemetry: {item.measurement}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[11px] text-neutral-400 italic">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Technician Notes & Recommendations */}
          <div className="bg-[#12161f] border border-white/10 rounded-xl p-6 space-y-4">
            <h4 className="font-bold text-white text-base">Technician Diagnostics Verdict</h4>
            <p className="text-xs text-neutral-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 font-mono">
              "{inspection.technicianNotes}"
            </p>

            <div>
              <span className="text-xs font-tech uppercase tracking-wider text-neutral-400 block mb-2">
                Actionable Recommendations
              </span>
              <div className="space-y-2">
                {inspection.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: QUOTATION */}
      {activeTab === 'quotation' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-tech uppercase tracking-widest text-[#ff5500]">
                Digital Quotation {quotation?.quotationNumber}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Itemized Parts & Labour Estimate</h3>
              <p className="text-xs text-neutral-400">
                Created following technician bore-scope and underbody inspection.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-tech font-bold uppercase tracking-wider ${
                  quotation?.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : quotation?.status === 'rejected'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                Status: {quotation?.status.toUpperCase()}
              </span>
            </div>
          </div>

          {quoteSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{quoteSuccessMsg}</span>
            </div>
          )}

          {/* Quotation Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-2">Scope Item / Component</th>
                  <th className="py-3 px-2">Classification</th>
                  <th className="py-3 px-2 text-right">Cost (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {quotation?.items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 text-white font-medium">{item.name}</td>
                    <td className="py-3 px-2">
                      <span className="text-[10px] font-tech uppercase px-2 py-0.5 rounded bg-white/5 text-neutral-400">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-white font-mono font-semibold">
                      ₹{item.cost.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-white/10 pt-4 max-w-sm ml-auto space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">₹{quotation?.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>GST @ 18%</span>
              <span className="font-mono text-white">₹{quotation?.gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
              <span className="font-tech uppercase tracking-wider">Total Quoted</span>
              <span className="font-mono text-[#ff5500]">₹{quotation?.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action Approval Bar */}
          {quotation?.status === 'pending' && (
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-neutral-300">
                Do you authorize our master technicians to commence repair according to this scope?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleApproveQuotation}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-600/30"
                >
                  Approve Quotation
                </button>
                <button
                  onClick={() => alert('Callback request registered. Our Service Advisor will call you within 15 minutes.')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech text-xs uppercase tracking-wider transition-colors"
                >
                  Request Changes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: INVOICE */}
      {activeTab === 'invoice' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Invoice & Billing Breakdown</h3>
              <p className="text-xs text-neutral-400">
                Official GST Tax Invoice from TORQX AUTOCARE Pune.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech text-xs uppercase tracking-wider transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300">
            <div>
              <span className="text-neutral-500 uppercase font-tech block">Billed To:</span>
              <strong className="text-white text-sm">{booking.customerName}</strong>
              <p>{booking.customerPhone}</p>
              <p>{booking.customerEmail}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-neutral-500 uppercase font-tech block">Invoice Reference:</span>
              <strong className="text-white text-sm">INV-{booking.id.replace('TORQX-', '')}</strong>
              <p>Vehicle: {booking.vehicleBrand} {booking.vehicleModel} ({booking.vehicleRegNumber})</p>
              <p>GSTIN: 27AABCT9981K1ZT</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-300">
              <span>{booking.serviceName} Package</span>
              <span className="font-mono text-white">₹{booking.priceBreakdown.serviceBasePrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>OEM Parts Replacement</span>
              <span className="font-mono text-white">₹{booking.priceBreakdown.partsEstimate.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Labour & Calibration</span>
              <span className="font-mono text-white">₹{booking.priceBreakdown.labourCharges.toLocaleString('en-IN')}</span>
            </div>
            {booking.priceBreakdown.addonsTotal > 0 && (
              <div className="flex justify-between text-neutral-300">
                <span>Add-on Packages</span>
                <span className="font-mono text-white">₹{booking.priceBreakdown.addonsTotal.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
              <span>Subtotal</span>
              <span className="font-mono">₹{booking.priceBreakdown.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {booking.priceBreakdown.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Coupon Discount ({booking.priceBreakdown.couponCode})</span>
                <span className="font-mono">-₹{booking.priceBreakdown.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-400">
              <span>GST @ 18%</span>
              <span className="font-mono">+₹{booking.priceBreakdown.gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between text-base font-extrabold text-[#ff5500]">
              <span className="font-tech uppercase tracking-wider">Grand Total</span>
              <span className="font-mono">₹{booking.priceBreakdown.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
