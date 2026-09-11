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
  FileCheck,
  CreditCard,
  QrCode,
  Check,
  Printer,
  ShieldAlert,
  Building,
  ExternalLink,
  Copy,
  RotateCcw
} from 'lucide-react';
import { Booking, ServiceStatus, InspectionReport, Quotation, Technician, Invoice, ServiceLifecycleStatus } from '../types';
import { BookingService } from '../services/bookingService';
import { StorageService, STORAGE_KEYS } from '../services/storageService';
import { BRAND_INFO } from '../data/automotiveData';
import { ServiceStateMachine, LIFECYCLE_STAGES } from '../services/serviceStateMachine';
import { InvoiceService } from '../services/invoiceService';
import { JobCardService } from '../services/jobCardService';
import { InventoryService } from '../services/inventoryService';
import { NotificationService } from '../services/notificationService';
import { AuditService } from '../services/auditService';

export const ServiceTracker: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'inspection' | 'quotation' | 'invoice'>('timeline');

  // Quotation approval state
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null);

  // Mock Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Cash at Counter'>('UPI');
  const [paymentMode, setPaymentMode] = useState<'full' | 'partial'>('full');
  const [customPayAmount, setCustomPayAmount] = useState<number>(0);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8842');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('742');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentTxnId, setPaymentTxnId] = useState<string>('');
  const [upiCopied, setUpiCopied] = useState(false);

  // Request change modal
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeNotes, setChangeNotes] = useState('');
  const [changeSubmitted, setChangeSubmitted] = useState(false);

  const currentId = bookingId || 'TORQX-2026-00482';

  const loadData = () => {
    let b = BookingService.getBookingById(currentId);
    if (!b) {
      const all = BookingService.getAllBookings();
      if (all.length > 0) b = all[0];
    }

    if (b) {
      setBooking(b);
      // Fetch or create invoice
      let inv = InvoiceService.getInvoiceByBookingId(b.id);
      if (!inv) {
        inv = InvoiceService.createInvoiceFromBooking(b);
      }
      setInvoice(inv);
      if (inv) {
        setCustomPayAmount(inv.remainingAmount ?? inv.total);
      }
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

  // Normalized Status and Stage index
  const normalizedStatus: ServiceLifecycleStatus = useMemo(() => {
    if (!booking) return 'BOOKING_CONFIRMED';
    return ServiceStateMachine.normalizeStatus(booking.status);
  }, [booking]);

  const currentStageIndex = useMemo(() => {
    const idx = LIFECYCLE_STAGES.findIndex((s) => s.status === normalizedStatus);
    return idx !== -1 ? idx : 0;
  }, [normalizedStatus]);

  // Advance Status simulator
  const handleAdvanceStatus = () => {
    if (!booking) return;
    const allowed = ServiceStateMachine.getAllowedTransitions(normalizedStatus);
    const nextStatus = allowed.length > 0 ? allowed[0] : 'COMPLETED';
    BookingService.updateBookingStatus(booking.id, nextStatus);
    if (booking.jobCardId) {
      JobCardService.updateJobStatus(booking.jobCardId, nextStatus, `Service stage progressed to ${nextStatus}`);
    }
    loadData();
  };

  const handleSetStatus = (status: ServiceStatus) => {
    if (!booking) return;
    const norm = ServiceStateMachine.normalizeStatus(status);
    BookingService.updateBookingStatus(booking.id, norm);
    if (booking.jobCardId) {
      JobCardService.updateJobStatus(booking.jobCardId, norm, `Status updated to ${norm}`);
    }
    loadData();
  };

  // Customer Quotation Approval Workflow
  const handleApproveQuotation = () => {
    if (!booking) return;
    BookingService.updateQuotationStatus(booking.id, 'approved');

    // Update job card and advance to parts reserved / work in progress
    if (booking.jobCardId) {
      JobCardService.updateJobStatus(booking.jobCardId, 'PARTS_RESERVED', 'Customer approved full quotation scope');
      JobCardService.updateJobStatus(booking.jobCardId, 'WORK_IN_PROGRESS', 'Parts verified & repair initiated');
    }
    BookingService.updateBookingStatus(booking.id, 'WORK_IN_PROGRESS');

    // Notify customer
    NotificationService.notifyUser(
      booking.customerEmail,
      'Quotation Approved - Repair Commenced',
      `Scope for your ${booking.vehicleBrand} ${booking.vehicleModel} has been authorized. Genuine OEM parts reserved and bay team has initiated servicing.`,
      'success'
    );

    // Audit log
    AuditService.log({
      userId: booking.userId || 'customer',
      userName: booking.customerName,
      userRole: 'customer',
      action: 'APPROVE_QUOTATION',
      entity: 'Quotation',
      entityId: quotation?.quotationNumber || booking.id,
      newValue: 'APPROVED'
    });

    setQuoteSuccessMsg('Quotation approved! Genuine parts reserved and workshop team has commenced work.');
    setTimeout(() => setQuoteSuccessMsg(null), 5000);
    loadData();
  };

  const handleSubmitScopeRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || !changeNotes.trim()) return;

    BookingService.updateQuotationStatus(booking.id, 'revision_requested' as any);
    NotificationService.notifyUser(
      'admin@torqxautocare.com',
      `Customer Scope Revision: ${booking.vehicleRegNumber}`,
      `Customer requested changes: "${changeNotes}"`,
      'warning'
    );

    setChangeSubmitted(true);
    setTimeout(() => {
      setShowChangeModal(false);
      setChangeSubmitted(false);
      setChangeNotes('');
      loadData();
    }, 2000);
  };

  // Mock Payment Execution
  const handleExecutePayment = () => {
    if (!invoice || !booking) return;
    setIsProcessingPayment(true);

    const amountToPay = paymentMode === 'full' ? (invoice.remainingAmount ?? invoice.total) : customPayAmount;
    const generatedTxn = `TXN-TORQX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      const result = InvoiceService.payInvoice(invoice.id, paymentMethod, amountToPay, generatedTxn);
      setIsProcessingPayment(false);

      if (result.success) {
        setPaymentTxnId(generatedTxn);
        setPaymentSuccess(true);
        loadData();

        NotificationService.notifyUser(
          booking.customerEmail,
          'Payment Successful - Receipt Generated',
          `Payment of ₹${amountToPay.toLocaleString('en-IN')} via ${paymentMethod} received for Invoice #${invoice.invoiceNumber}.`,
          'success'
        );

        AuditService.log({
          userId: booking.userId || 'customer',
          userName: booking.customerName,
          userRole: 'customer',
          action: 'PAY_INVOICE',
          entity: 'Invoice',
          entityId: invoice.invoiceNumber,
          newValue: `PAID_INR_${amountToPay}`
        });

        setTimeout(() => {
          setPaymentSuccess(false);
          setShowPaymentModal(false);
        }, 3000);
      }
    }, 1500);
  };

  const copyUpiId = () => {
    navigator.clipboard?.writeText('torqx.autocare@icici');
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center text-neutral-400">
        <Car className="w-12 h-12 text-neutral-600 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white mb-2">Booking Record Not Found</h3>
        <p className="text-sm max-w-md mb-6">
          We could not locate booking reference ID "{currentId}". You can view our demo vehicle tracker.
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

  const invoicePaid = invoice?.paymentStatus === 'paid';
  const remainingBalance = invoice?.remainingAmount ?? (invoice ? invoice.total - (invoice.paidAmount || 0) : 0);

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
              {booking.jobCardNumber && (
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-mono text-cyan-400">
                  JC: {booking.jobCardNumber}
                </span>
              )}
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
                {booking.deliveryTimestamp || 'Today, 6:30 PM'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>On Schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulator & Communication Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-tech text-neutral-400 uppercase text-[11px]">
              Workflow Simulator:
            </span>
            <button
              onClick={handleAdvanceStatus}
              className="px-3 py-1.5 rounded bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech uppercase text-[11px] font-bold tracking-wider transition-colors shadow flex items-center gap-1"
            >
              <span>Advance Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <select
              value={normalizedStatus}
              onChange={(e) => handleSetStatus(e.target.value as ServiceStatus)}
              className="bg-black/60 border border-white/15 rounded px-2.5 py-1.5 text-white font-tech text-xs"
            >
              {LIFECYCLE_STAGES.filter((s) => s.status !== 'CANCELLED').map((s) => (
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-tech text-xs tracking-wider transition-colors"
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
          { id: 'timeline', label: '11-Step Lifecycle Pipeline', icon: Layers },
          { id: 'inspection', label: 'Digital Vehicle Inspection Report', icon: Activity },
          { id: 'quotation', label: 'Quotation & Scope Approval', icon: FileCheck },
          { id: 'invoice', label: 'Official GST Invoice & Payment', icon: FileText }
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
              {tab.id === 'quotation' && quotation?.status === 'pending' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
              {tab.id === 'invoice' && !invoicePaid && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                  DUE
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#ff5500]" />
                Interactive Service Progression
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Real-time workflow synchronized across Customer, Service Advisor, and Master Technician terminals.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-tech uppercase text-neutral-400 block">Overall Progress</span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {Math.round(((currentStageIndex + 1) / (LIFECYCLE_STAGES.length - 1)) * 100)}% Completed
              </span>
            </div>
          </div>

          {/* 11 Step Vertical / Responsive Timeline */}
          <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
            {LIFECYCLE_STAGES.filter((s) => s.status !== 'CANCELLED').map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

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
                          Step {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-bold text-base text-white">{stage.label}</h4>
                      </div>

                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ff5500] text-white text-[10px] font-tech font-bold uppercase tracking-wider self-start sm:self-auto">
                          Active Phase
                        </span>
                      )}
                      {isPast && (
                        <span className="text-xs text-emerald-400 font-tech font-bold">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 mt-1">{stage.description}</p>
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
              <h3 className="text-2xl font-bold text-white">60-Point Diagnostic Inspection Report</h3>
              <p className="text-xs text-neutral-400 max-w-xl">
                OBD-II live ECU telemetry analysis, brake pad micrometer readings, suspension tolerance tests, and fluid spectrometry.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10">
              <div className="relative flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" className="text-white/10" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-emerald-400"
                    strokeDasharray={213}
                    strokeDashoffset={213 - (213 * inspection.overallHealthScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute font-mono font-extrabold text-xl text-white">
                  {inspection.overallHealthScore}%
                </span>
              </div>
              <div>
                <span className="text-xs font-tech uppercase text-neutral-400 block">Overall Score</span>
                <strong className="text-sm text-emerald-400 font-bold">Factory Certified</strong>
                <span className="text-[11px] text-neutral-500 block">Inspection Date: {inspection.date}</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(inspection.categories).map((cat, idx) => {
              const hasCritical = cat.items.some((it) => it.status === 'CRITICAL' || it.status === 'URGENT');
              const hasAttention = cat.items.some((it) => it.status === 'ATTENTION');
              const categoryBadge = hasCritical ? 'Action Required' : hasAttention ? 'Attention' : 'Optimal';
              const badgeClass = hasCritical
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : hasAttention
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

              return (
                <div key={idx} className="bg-[#12161f] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h4 className="font-bold text-sm text-white">{cat.title}</h4>
                    <span
                      className={`text-[10px] font-tech font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClass}`}
                    >
                      {categoryBadge}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {cat.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between items-center text-neutral-300">
                        <span>{item.name}</span>
                        <span className="font-mono text-neutral-400">{item.measurement || item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: QUOTATION & APPROVAL */}
      {activeTab === 'quotation' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-tech uppercase tracking-widest text-[#ff5500]">
                Digital Quotation {quotation?.quotationNumber || 'TORQX-Q-00482'}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Itemized Parts & Labour Scope</h3>
              <p className="text-xs text-neutral-400">
                Created following technician inspection. Parts are authentic OEM with warranty certification.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-tech font-bold uppercase tracking-wider ${
                  quotation?.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : quotation?.status === 'rejected'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : quotation?.status === ('revision_requested' as any)
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                Status: {(quotation?.status || 'PENDING').replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {quoteSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
                  <th className="py-3 px-2">Warranty</th>
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
                    <td className="py-3 px-2 text-neutral-400 font-tech">
                      {item.type === 'parts' ? '12 Mo / 20,000 km' : '6 Mo / 10,000 km'}
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
              <span>GST @ 18% (CGST 9% + SGST 9%)</span>
              <span className="font-mono text-white">₹{quotation?.gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
              <span className="font-tech uppercase tracking-wider">Total Quoted</span>
              <span className="font-mono text-[#ff5500]">₹{quotation?.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action Approval Bar */}
          {quotation?.status === 'pending' && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-black/40 to-black/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-bold text-sm">Authorize Workshop Execution</h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Authorizing immediately requisitions OEM parts from central stock and assigns bay technicians.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleApproveQuotation}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Scope</span>
                </button>
                <button
                  onClick={() => setShowChangeModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech text-xs uppercase tracking-wider transition-colors"
                >
                  Request Revision
                </button>
              </div>
            </div>
          )}

          {quotation?.status === 'approved' && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Scope authorized by owner. Genuine OEM parts reserved in inventory.</span>
              </div>
              <button
                onClick={() => setActiveTab('timeline')}
                className="text-xs font-tech text-[#ff5500] hover:underline"
              >
                Track Progress ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: INVOICE & PAYMENT */}
      {activeTab === 'invoice' && invoice && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Official Tax Invoice</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-tech font-bold uppercase tracking-wider ${
                    invoicePaid
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {invoicePaid ? 'PAID IN FULL' : 'PAYMENT PENDING'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                GSTIN: <strong>{invoice.gstin || '27AAACT2026Q1Z5'}</strong> • SAC Code: <strong>{invoice.sacCode || '998714'}</strong> (Automotive Maintenance Services)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech text-xs uppercase tracking-wider transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              {!invoicePaid && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-600/30"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Online (UPI / Card)</span>
                </button>
              )}
            </div>
          </div>

          {/* Invoice Header Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300 bg-black/30 p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-neutral-500 uppercase font-tech block text-[10px]">Billed Customer</span>
              <strong className="text-white text-sm block">{invoice.customerName}</strong>
              <p>{invoice.customerPhone}</p>
              <p>{invoice.customerEmail}</p>
              <p className="text-neutral-400 mt-1">{invoice.customerAddress || 'Pune, Maharashtra'}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-neutral-500 uppercase font-tech block text-[10px]">Invoice Summary</span>
              <strong className="text-white text-sm block font-mono text-[#ff5500]">{invoice.invoiceNumber}</strong>
              <p>Date: {invoice.date}</p>
              <p>Vehicle: {invoice.vehicleDetails} ({invoice.vehicleReg})</p>
              {invoice.jobCardNumber && <p className="font-mono text-neutral-400">JC Ref: {invoice.jobCardNumber}</p>}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Rate (INR)</th>
                  <th className="py-3 px-2 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoice.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 text-white font-medium">{it.description}</td>
                    <td className="py-3 px-2 text-center font-mono text-neutral-400">{it.quantity}</td>
                    <td className="py-3 px-2 text-right font-mono text-neutral-300">₹{it.rate.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-2 text-right font-mono text-white font-semibold">₹{it.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Tax Breakdown */}
          <div className="border-t border-white/10 pt-4 max-w-md ml-auto space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Taxable Subtotal</span>
              <span className="font-mono text-white">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount Applied {invoice.couponCode ? `(${invoice.couponCode})` : ''}</span>
                <span className="font-mono">-₹{invoice.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-400">
              <span>Central GST (CGST @ 9%)</span>
              <span className="font-mono text-white">₹{(invoice.cgst ?? Math.round(invoice.gst / 2)).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>State GST (SGST @ 9%)</span>
              <span className="font-mono text-white">₹{(invoice.sgst ?? Math.round(invoice.gst / 2)).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
              <span className="font-tech uppercase tracking-wider">Grand Total (Incl. GST)</span>
              <span className="font-mono text-[#ff5500]">₹{invoice.total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-300 pt-1">
              <span>Amount Paid</span>
              <span className="font-mono text-emerald-400">₹{(invoice.paidAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
              <span className="font-tech uppercase tracking-wider">Balance Due</span>
              <span className="font-mono text-amber-400">₹{remainingBalance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment CTA Banner */}
          {!invoicePaid ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-black/40 to-black/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Instant Payment Settlement (Mock Engine)</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Choose between Instant UPI QR code, Credit/Debit Card, or Net Banking. Receipt with QR verification is generated automatically.
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-600/30 shrink-0"
              >
                Pay Balance ₹{remainingBalance.toLocaleString('en-IN')}
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Invoice Settled in Full</h4>
                  <p className="text-xs text-neutral-400">
                    Payment verified. Transaction Ref: <strong className="font-mono text-emerald-400">TXN-TORQX-PAID</strong> • 12 Months Warranty Active.
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save PDF Receipt</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* MOCK PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentModal && invoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#12161f] border border-white/15 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-tech font-bold uppercase tracking-wider text-[#ff5500]">
                    TORQX Secure Payment Gateway
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Settle Invoice {invoice.invoiceNumber}</h3>
                  <p className="text-xs text-neutral-400">Official GST Invoice for {booking.vehicleBrand} {booking.vehicleModel}</p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-neutral-500 hover:text-white p-1"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Payment Success View */}
              {paymentSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Payment Confirmed!</h4>
                    <p className="text-xs text-neutral-400 mt-1">Transaction Ref: <strong className="font-mono text-emerald-400">{paymentTxnId}</strong></p>
                    <p className="text-xs text-neutral-400">An official GST tax receipt has been sent to {booking.customerEmail}.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Amount Options */}
                  <div className="space-y-2">
                    <span className="text-xs font-tech uppercase text-neutral-400 block">Payment Amount</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMode('full')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentMode === 'full'
                            ? 'bg-[#ff5500]/15 border-[#ff5500] text-white'
                            : 'bg-black/30 border-white/10 text-neutral-400'
                        }`}
                      >
                        <span className="text-[10px] font-tech uppercase block">Pay Full Balance</span>
                        <strong className="text-base font-mono font-bold text-white">₹{remainingBalance.toLocaleString('en-IN')}</strong>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMode('partial')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentMode === 'partial'
                            ? 'bg-[#ff5500]/15 border-[#ff5500] text-white'
                            : 'bg-black/30 border-white/10 text-neutral-400'
                        }`}
                      >
                        <span className="text-[10px] font-tech uppercase block">Partial Advance</span>
                        <strong className="text-base font-mono font-bold text-white">
                          ₹{Math.min(5000, remainingBalance).toLocaleString('en-IN')}
                        </strong>
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-tech uppercase text-neutral-400 block">Select Method</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'UPI', label: 'UPI QR', icon: QrCode },
                        { id: 'Card', label: 'Card', icon: CreditCard },
                        { id: 'Net Banking', label: 'NetBank', icon: Building },
                        { id: 'Cash at Counter', label: 'Counter', icon: FileCheck }
                      ].map((m) => {
                        const Icon = m.icon;
                        const isSel = paymentMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPaymentMethod(m.id as any)}
                            className={`p-2.5 rounded-xl border text-center font-tech text-xs uppercase tracking-wider transition-all flex flex-col items-center gap-1.5 ${
                              isSel
                                ? 'bg-[#ff5500] text-white border-[#ff5500] font-bold shadow'
                                : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[10px]">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Method Details */}
                  {paymentMethod === 'UPI' && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="w-28 h-28 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=torqx.autocare@icici%26pn=TORQX%20AUTOCARE%26am=${paymentMode === 'full' ? remainingBalance : customPayAmount}`}
                          alt="UPI QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] font-tech uppercase text-neutral-400 block">Scan with GPay, PhonePe, Paytm</span>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <code className="text-white font-mono bg-white/10 px-2 py-0.5 rounded text-xs">torqx.autocare@icici</code>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="text-neutral-400 hover:text-white"
                          >
                            {upiCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          Auto-verified within 5 seconds of confirmation in your UPI app.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-tech uppercase text-neutral-400 block mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ff5500] focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-tech uppercase text-neutral-400 block mb-1">Expiry MM/YY</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ff5500] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-tech uppercase text-neutral-400 block mb-1">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ff5500] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Net Banking' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-tech uppercase text-neutral-400 block">Select Banking Institution</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#ff5500] focus:outline-none"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'Cash at Counter' && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-neutral-300 space-y-1">
                      <strong className="text-white block">Pay at Workshop Cash Counter</strong>
                      <p>You can pay via cash, POS card swipe, or UPI at TORQX Reception Desk when collecting your vehicle.</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-tech text-xs uppercase"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={handleExecutePayment}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                    >
                      {isProcessingPayment ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying with Bank...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Confirm Payment ₹{(paymentMode === 'full' ? remainingBalance : customPayAmount).toLocaleString('en-IN')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REQUEST REVISION MODAL */}
      <AnimatePresence>
        {showChangeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#12161f] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">Request Quotation Changes</h3>
                  <p className="text-xs text-neutral-400">Specify scopes you wish to remove or request advisor guidance.</p>
                </div>
                <button onClick={() => setShowChangeModal(false)} className="text-neutral-500 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {changeSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Revision request submitted. Service advisor will call you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitScopeRevision} className="space-y-4">
                  <textarea
                    rows={4}
                    required
                    value={changeNotes}
                    onChange={(e) => setChangeNotes(e.target.value)}
                    placeholder="e.g. Please defer the front brake pad replacement until the next service. Proceed with synthetic oil change and AC servicing only."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#ff5500] focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowChangeModal(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 text-neutral-400 text-xs font-tech uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white text-xs font-tech font-bold uppercase"
                    >
                      Submit Revision Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
